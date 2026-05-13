"""
CBT Proctoring – FastAPI WebSocket Service
==========================================
Endpoint utama:
  WS  /ws/proctoring/{exam_id}/{user_id}
  GET /health

Alur WebSocket:
  1. Client (Next.js) kirim frame tiap ~500ms:
       { "frame": "<base64>", "timestamp": "<iso>" }

  2. Server balas tiap frame:
       { "type": "frame_result", "face_count": 1, "events": [...], "risk_score": 15 }

  3. Saat ujian selesai, client kirim:
       { "action": "end_session" }

  4. Server push ke Laravel lalu balas:
       { "type": "session_ended", "summary": { ... } }
"""

import asyncio
import json
import os
from typing import Dict

import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from detector import ProctoringDetector

# ── Konfigurasi ─────────────────────────────────────────────────────────────
LARAVEL_API_URL  = os.getenv("LARAVEL_API_URL", "http://localhost:8000/api")
LARAVEL_API_KEY  = os.getenv("LARAVEL_API_KEY", "")          # opsional bearer token
YAW_THRESHOLD       = float(os.getenv("YAW_THRESHOLD", "20"))   # derajat
MAX_FACES           = int(os.getenv("MAX_FACES", "1"))
LOOKING_AWAY_SECS   = float(os.getenv("LOOKING_AWAY_SECS", "5"))  # detik

RISK_WEIGHTS = {"no_face": 10, "multiple_faces": 20, "looking_away": 5}

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="CBT Proctoring Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ganti ke domain Next.js lu di production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# session_key → ProctoringDetector
_sessions: Dict[str, ProctoringDetector] = {}


# ── WebSocket endpoint ───────────────────────────────────────────────────────
@app.websocket("/ws/proctoring/{peserta_ujian_id}")
async def proctoring_ws(websocket: WebSocket, peserta_ujian_id: str):
    await websocket.accept()

    detector = ProctoringDetector(
        yaw_threshold=YAW_THRESHOLD,
        max_allowed_faces=MAX_FACES,
        looking_away_duration=LOOKING_AWAY_SECS,
    )
    _sessions[peserta_ujian_id] = detector

    print(f"[+] Session started  -> peserta_ujian_id={peserta_ujian_id}")

    try:
        while True:
            raw     = await websocket.receive_text()
            payload = json.loads(raw)

            # ── Akhir sesi ──────────────────────────────────────────
            if payload.get("action") == "end_session":
                summary = detector.get_session_summary()

                # Kirim ke Laravel (non-blocking)
                asyncio.create_task(
                    _push_to_laravel(peserta_ujian_id, summary)
                )

                await websocket.send_text(json.dumps({
                    "type":    "session_ended",
                    "summary": summary,
                }))
                print(f"[-] Session ended    -> peserta_ujian_id={peserta_ujian_id}  risk={summary['risk_score']}")
                break

            # ── Proses frame ─────────────────────────────────────────
            if "frame" in payload:
                loop   = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    None, detector.analyze_frame, payload["frame"]
                )
                await websocket.send_text(json.dumps({
                    "type": "frame_result",
                    **result,
                }))

    except WebSocketDisconnect:
        print(f"[!] Client disconnected -> peserta_ujian_id={peserta_ujian_id}")

    finally:
        _sessions.pop(peserta_ujian_id, None)


# ── Push ke Laravel ──────────────────────────────────────────────────────────
async def _push_to_laravel(peserta_ujian_id: str, summary: dict):
    url     = f"{LARAVEL_API_URL}/proctoring/save"
    headers = {"Content-Type": "application/json"}
    if LARAVEL_API_KEY:
        headers["Authorization"] = f"Bearer {LARAVEL_API_KEY}"

    # Sesuaikan format ke kolom ProctoringLog:
    # peserta_ujian_id | tipe_pelanggaran | risk_score | waktu
    events_payload = [
        {
            "tipe_pelanggaran": ev["type"],
            "risk_score":       RISK_WEIGHTS.get(ev["type"], 0),
            "waktu":            ev["timestamp"],
        }
        for ev in summary.get("events", [])
    ]

    if not events_payload:
        print("[Laravel] Tidak ada event, skip push.")
        return

    body = {
        "peserta_ujian_id": peserta_ujian_id,
        "events":           events_payload,
    }

    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.post(url, json=body, headers=headers)
            print(f"[Laravel] POST {url} → {resp.status_code}")
        except Exception as exc:
            print(f"[Laravel] Gagal push: {exc}")


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":          "ok",
        "active_sessions": len(_sessions),
    }


# ── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
