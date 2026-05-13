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

    def __init__(self, yaw_threshold: float = 20.0, max_allowed_faces: int = 1,
                 looking_away_duration: float = 5.0):
        """
        yaw_threshold          – sudut (derajat) nengok kiri/kanan sebelum dianggap curang
        max_allowed_faces      – normalnya 1; kalau lebih → multiple_faces event
        looking_away_duration  – detik terus-menerus nengok sebelum event di-fire
        """
        self.yaw_threshold = yaw_threshold
        self.max_allowed_faces = max_allowed_faces
        self.looking_away_duration = timedelta(seconds=looking_away_duration)

        # timer untuk debounce looking_away
        self._looking_away_since: Optional[datetime] = None
        self._looking_away_fired: bool = False

        # Haar cascade untuk counting — lebih robust terhadap partial/multi-face
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        self._cascade = cv2.CascadeClassifier(cascade_path)

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

        # ── 1. Deteksi jumlah wajah (Haar Cascade) ───────────────────
        gray  = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray  = cv2.equalizeHist(gray)
        faces = self._cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=4,
            minSize=(40, 40),
        )
        face_count = len(faces)

        if face_count == 0:
            ev = self._add_event("no_face", ts, {"message": "Tidak ada wajah terdeteksi"})
            frame_events.append(ev)
            return {"face_count": 0, "events": frame_events, "risk_score": self.risk_score}

        if face_count > self.max_allowed_faces:
            ev = self._add_event("multiple_faces", ts, {
                "message": f"Terdeteksi {face_count} wajah dalam frame",
                "count": face_count,
            })
            frame_events.append(ev)

        # ── 2. Head pose (hanya saat 1 wajah) ───────────────────────
        if face_count == 1:
            mesh_result = self._mp_mesh.process(rgb)
            is_looking_away = False

            if mesh_result.multi_face_landmarks:
                lm = mesh_result.multi_face_landmarks[0].landmark
                yaw = self._get_yaw(lm, frame.shape)
                if yaw is not None and abs(yaw) > self.yaw_threshold:
                    is_looking_away = True
                    now = datetime.now()

                    if self._looking_away_since is None:
                        # mulai timer
                        self._looking_away_since = now
                        self._looking_away_fired = False
                    elif not self._looking_away_fired:
                        elapsed = now - self._looking_away_since
                        if elapsed >= self.looking_away_duration:
                            direction = "kanan" if yaw > 0 else "kiri"
                            ev = self._add_event("looking_away", ts, {
                                "message": f"Peserta menengok ke {direction} selama {int(elapsed.total_seconds())}s",
                                "direction": direction,
                                "yaw_deg": round(float(yaw), 2),
                                "duration_sec": round(elapsed.total_seconds(), 1),
                            })
                            frame_events.append(ev)
                            self._looking_away_fired = True

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
        self._looking_away_fired = False

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

    def _get_yaw(self, landmarks, frame_shape) -> Optional[float]:
        """
        Hitung yaw (rotasi horizontal kepala) pakai solvePnP.
        Return derajat: positif = nengok kanan, negatif = nengok kiri.
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
        # RQDecomp3x3 → (angles_deg, R, Q, Qx, Qy, Qz)
        angles, *_ = cv2.RQDecomp3x3(rmat)
        # angles[1] = yaw
        return float(angles[1])
