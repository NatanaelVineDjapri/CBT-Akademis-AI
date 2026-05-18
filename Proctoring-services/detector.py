import os
import cv2
import numpy as np
import base64
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import List, Optional

try:
    import mediapipe as mp
    _FaceMesh = mp.solutions.face_mesh.FaceMesh
    _MEDIAPIPE_OK = True
except AttributeError:
    _MEDIAPIPE_OK = False

RISK_WEIGHTS = {
    "no_face":        10,
    "multiple_faces": 20,
    "looking_away":    5,
}


@dataclass
class ProctoringEvent:
    type: str
    timestamp: str
    detail: dict = field(default_factory=dict)

    def to_dict(self):
        return {"type": self.type, "timestamp": self.timestamp, "detail": self.detail}


class ProctoringDetector:
    _MODEL_POINTS = np.array([
        (0.0,    0.0,    0.0),
        (0.0,  -63.6,  -12.5),
        (-43.3,  32.7,  -26.0),
        (43.3,   32.7,  -26.0),
        (-28.9, -28.9,  -24.1),
        (28.9,  -28.9,  -24.1),
    ], dtype=np.float64)

    _LM_INDICES = [4, 152, 263, 33, 287, 57]

    def __init__(self, yaw_threshold: float = 20.0, pitch_threshold: float = 15.0,
                 max_allowed_faces: int = 1, looking_away_duration: float = 5.0):
        self.yaw_threshold = yaw_threshold
        self.pitch_threshold = pitch_threshold
        self.max_allowed_faces = max_allowed_faces
        self.looking_away_duration = timedelta(seconds=looking_away_duration)

        self._looking_away_since: Optional[datetime] = None
        self._multi_face_since: Optional[datetime] = None

        base = os.path.dirname(os.path.abspath(__file__))
        self._dnn = cv2.dnn.readNetFromCaffe(
            os.path.join(base, "deploy.prototxt"),
            os.path.join(base, "face_detector.caffemodel"),
        )

        if _MEDIAPIPE_OK:
            self._mp_mesh = _FaceMesh(
                max_num_faces=5,
                refine_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5,
            )
        else:
            self._mp_mesh = None
            print("[ProctoringDetector] mediapipe.solutions tidak tersedia — looking_away dinonaktifkan")

        self.events: List[ProctoringEvent] = []
        self.risk_score: int = 0

    def analyze_frame(self, base64_frame: str) -> dict:
        frame = self._decode_frame(base64_frame)
        rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        ts    = datetime.now().isoformat()

        frame_events: List[dict] = []

        blob = cv2.dnn.blobFromImage(
            cv2.resize(frame, (300, 300)), 1.0,
            (300, 300), (104.0, 177.0, 123.0),
        )
        self._dnn.setInput(blob)
        detections = self._dnn.forward()
        face_count = sum(
            1 for i in range(detections.shape[2])
            if detections[0, 0, i, 2] > 0.5
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
                self._multi_face_since = now
        else:
            self._multi_face_since = None

        if face_count == 1 and self._mp_mesh is not None:
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
                                direction = "kanan" if abs(yaw) > self.yaw_threshold and yaw > 0 else \
                                            "kiri"  if abs(yaw) > self.yaw_threshold else \
                                            "atas"  if pitch > 0 else "bawah"
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
                self._looking_away_since = None

        return {"face_count": face_count, "events": frame_events, "risk_score": self.risk_score}

    def get_session_summary(self) -> dict:
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
        self.events = []
        self.risk_score = 0
        self._looking_away_since = None
        self._multi_face_since = None

    def _add_event(self, etype: str, ts: str, detail: dict) -> dict:
        ev = ProctoringEvent(type=etype, timestamp=ts, detail=detail)
        self.events.append(ev)
        self.risk_score += RISK_WEIGHTS.get(etype, 0)
        return ev.to_dict()

    def _decode_frame(self, b64: str) -> np.ndarray:
        if "," in b64:
            b64 = b64.split(",", 1)[1]
        raw = base64.b64decode(b64)
        arr = np.frombuffer(raw, np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)

    def _get_head_pose(self, landmarks, frame_shape) -> Optional[tuple]:
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
        return float(angles[1]), float(angles[0])
