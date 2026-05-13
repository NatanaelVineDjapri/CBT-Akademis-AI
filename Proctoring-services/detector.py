import os
import cv2
import mediapipe as mp
import numpy as np
import base64
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import List, Optional, Tuple


# ---------- Risk score per kejadian ----------
RISK_WEIGHTS = {
    "no_face":        10,
    "multiple_faces": 20,
    "looking_away":    5,
}


@dataclass
class ProctoringEvent:
    type: str          # "no_face" | "multiple_faces" | "looking_away"
    timestamp: str
    detail: dict = field(default_factory=dict)

    def to_dict(self):
        return {
            "type": self.type,
            "timestamp": self.timestamp,
            "detail": self.detail,
        }


class ProctoringDetector:
    """
    Deteksi kecurangan real-time via MediaPipe.
    - no_face         → wajah tidak terdeteksi
    - multiple_faces  → lebih dari 1 wajah dalam frame
    - looking_away    → kepala menengok kiri / kanan melebihi threshold
    """

    # Titik 3-D referensi wajah (model generik, satuan mm)
    _MODEL_POINTS = np.array([
        (0.0,    0.0,    0.0),     # Nose tip       → landmark 4
        (0.0,  -63.6,  -12.5),    # Chin            → landmark 152
        (-43.3,  32.7,  -26.0),   # Left eye outer  → landmark 263
        (43.3,   32.7,  -26.0),   # Right eye outer → landmark 33
        (-28.9, -28.9,  -24.1),   # Left mouth      → landmark 287
        (28.9,  -28.9,  -24.1),   # Right mouth     → landmark 57
    ], dtype=np.float64)

    _LM_INDICES = [4, 152, 263, 33, 287, 57]

    def __init__(self, yaw_threshold: float = 20.0, pitch_threshold: float = 15.0,
                 max_allowed_faces: int = 1, looking_away_duration: float = 5.0):
        """
        yaw_threshold          – sudut (derajat) nengok kiri/kanan sebelum dianggap curang
        max_allowed_faces      – normalnya 1; kalau lebih → multiple_faces event
        looking_away_duration  – detik terus-menerus nengok sebelum event di-fire
        """
        self.yaw_threshold = yaw_threshold
        self.pitch_threshold = pitch_threshold
        self.max_allowed_faces = max_allowed_faces
        self.looking_away_duration = timedelta(seconds=looking_away_duration)

        self._looking_away_since: Optional[datetime] = None
        self._multi_face_since: Optional[datetime] = None

        # OpenCV DNN face detector — lebih akurat dari Haar Cascade
        base = os.path.dirname(os.path.abspath(__file__))
        self._dnn = cv2.dnn.readNetFromCaffe(
            os.path.join(base, "deploy.prototxt"),
            os.path.join(base, "face_detector.caffemodel"),
        )

        # FaceMesh hanya untuk head-pose (1 wajah utama)
        self._mp_mesh = mp.solutions.face_mesh.FaceMesh(
            max_num_faces=5,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        self.events: List[ProctoringEvent] = []
        self.risk_score: int = 0

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def analyze_frame(self, base64_frame: str) -> dict:
        """
        Terima 1 frame (base64 JPEG/PNG dari Next.js), kembalikan:
        {
            face_count: int,
            events: [...],          ← event yang terjadi di frame ini
            risk_score: int         ← akumulasi risk score sepanjang sesi
        }
        """
        frame = self._decode_frame(base64_frame)
        rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        ts    = datetime.now().isoformat()

        frame_events: List[dict] = []

        # ── 1. Deteksi jumlah wajah (OpenCV DNN) ─────────────────────
        blob = cv2.dnn.blobFromImage(
            cv2.resize(frame, (300, 300)), 1.0,
            (300, 300), (104.0, 177.0, 123.0),
        )
        self._dnn.setInput(blob)
        detections = self._dnn.forward()
        face_count = sum(
            1 for i in range(detections.shape[2])
            if detections[0, 0, i, 2] > 0.5  # confidence threshold
        )

        if face_count == 0:
            ev = self._add_event("no_face", ts, {"message": "Tidak ada wajah terdeteksi"})
            frame_events.append(ev)
            return {"face_count": 0, "events": frame_events, "risk_score": self.risk_score}

        if face_count > self.max_allowed_faces:
            now = datetime.now()
            if self._multi_face_since is None:
                self._multi_face_since = now
            elif now - self._multi_face_since >= self.looking_away_duration:
                ev = self._add_event("multiple_faces", ts, {
                    "message": f"Terdeteksi {face_count} wajah selama {int((now - self._multi_face_since).total_seconds())}s",
                    "count": face_count,
                })
                frame_events.append(ev)
                self._multi_face_since = now  # reset timer, bisa fire lagi 5 detik kemudian
        else:
            self._multi_face_since = None

        # ── 2. Head pose (hanya saat 1 wajah) ───────────────────────
        if face_count == 1:
            mesh_result = self._mp_mesh.process(rgb)
            is_looking_away = False

            if mesh_result.multi_face_landmarks:
                lm = mesh_result.multi_face_landmarks[0].landmark
                pose = self._get_head_pose(lm, frame.shape)
                if pose is not None:
                    yaw, pitch = pose
                    if abs(yaw) > self.yaw_threshold or abs(pitch) > self.pitch_threshold:
                        is_looking_away = True
                        now = datetime.now()

                        if self._looking_away_since is None:
                            self._looking_away_since = now
                        else:
                            elapsed = now - self._looking_away_since
                            if elapsed >= self.looking_away_duration:
                                if abs(yaw) > self.yaw_threshold:
                                    direction = "kanan" if yaw > 0 else "kiri"
                                else:
                                    direction = "atas" if pitch > 0 else "bawah"
                                ev = self._add_event("looking_away", ts, {
                                    "message": f"Peserta menengok ke {direction} selama {int(elapsed.total_seconds())}s",
                                    "direction": direction,
                                    "yaw_deg": round(yaw, 2),
                                    "pitch_deg": round(pitch, 2),
                                    "duration_sec": round(elapsed.total_seconds(), 1),
                                })
                                frame_events.append(ev)
                                self._looking_away_since = now

            if not is_looking_away:
                # kembali lurus → reset timer supaya bisa trigger lagi nanti
                self._looking_away_since = None
                self._looking_away_fired = False

        return {"face_count": face_count, "events": frame_events, "risk_score": self.risk_score}

    def get_session_summary(self) -> dict:
        """Ringkasan akhir sesi — dikirim ke Laravel saat ujian selesai."""
        breakdown: dict = {}
        for ev in self.events:
            breakdown[ev.type] = breakdown.get(ev.type, 0) + 1

        return {
            "risk_score":      self.risk_score,
            "total_events":    len(self.events),
            "event_breakdown": breakdown,
            "events":          [e.to_dict() for e in self.events],
        }

    def reset(self):
        """Reset state untuk sesi baru."""
        self.events = []
        self.risk_score = 0
        self._looking_away_since = None
        self._multi_face_since = None

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _add_event(self, etype: str, ts: str, detail: dict) -> dict:
        ev = ProctoringEvent(type=etype, timestamp=ts, detail=detail)
        self.events.append(ev)
        self.risk_score += RISK_WEIGHTS.get(etype, 0)
        return ev.to_dict()

    def _decode_frame(self, b64: str) -> np.ndarray:
        # Hapus header data-URL kalau ada (misal: "data:image/jpeg;base64,...")
        if "," in b64:
            b64 = b64.split(",", 1)[1]
        raw = base64.b64decode(b64)
        arr = np.frombuffer(raw, np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)

    def _get_head_pose(self, landmarks, frame_shape) -> Optional[tuple]:
        """
        Hitung yaw & pitch pakai solvePnP.
        Return (yaw, pitch) dalam derajat:
          yaw   → positif = kanan, negatif = kiri
          pitch → positif = atas,  negatif = bawah
        """
        h, w = frame_shape[:2]

        img_pts = np.array([
            (landmarks[i].x * w, landmarks[i].y * h)
            for i in self._LM_INDICES
        ], dtype=np.float64)

        focal  = float(w)
        cam_mx = np.array([
            [focal, 0,     w / 2],
            [0,     focal, h / 2],
            [0,     0,     1    ],
        ], dtype=np.float64)

        ok, rvec, _ = cv2.solvePnP(
            self._MODEL_POINTS, img_pts,
            cam_mx, np.zeros((4, 1)),
            flags=cv2.SOLVEPNP_ITERATIVE,
        )
        if not ok:
            return None

        rmat, _ = cv2.Rodrigues(rvec)
        angles, *_ = cv2.RQDecomp3x3(rmat)
        return float(angles[1]), float(angles[0])  # yaw, pitch
