"""
test_camera.py
Jalanin: python test_camera.py
Tekan Q untuk keluar.
"""

import cv2
import mediapipe as mp
import numpy as np

# ── Konfigurasi ──────────────────────────────────────────────────────────────
YAW_THRESHOLD = 20   # derajat nengok kiri/kanan

MODEL_POINTS = np.array([
    (0.0,    0.0,    0.0),
    (0.0,  -63.6,  -12.5),
    (-43.3,  32.7,  -26.0),
    (43.3,   32.7,  -26.0),
    (-28.9, -28.9,  -24.1),
    (28.9,  -28.9,  -24.1),
], dtype=np.float64)
LM_INDICES = [4, 152, 263, 33, 287, 57]

# ── Init MediaPipe ────────────────────────────────────────────────────────────
mp_detection = mp.solutions.face_detection.FaceDetection(
    model_selection=1, min_detection_confidence=0.65
)
mp_mesh = mp.solutions.face_mesh.FaceMesh(
    max_num_faces=5,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)

# ── Buka kamera ──────────────────────────────────────────────────────────────
cap = cv2.VideoCapture(0)
print("Kamera nyala! Tekan Q untuk keluar.\n")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Gagal baca kamera.")
        break

    rgb    = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    h, w   = frame.shape[:2]
    status = ""
    color  = (0, 255, 0)   # hijau = aman

    # ── Deteksi wajah ────────────────────────────────────────────────────────
    det = mp_detection.process(rgb)

    if not det.detections:
        status = "NO FACE"
        color  = (0, 0, 255)   # merah

    else:
        face_count = len(det.detections)

        if face_count > 1:
            status = f"MULTIPLE FACES ({face_count})"
            color  = (0, 165, 255)   # oranye

        else:
            # ── Head pose ─────────────────────────────────────────────────
            mesh = mp_mesh.process(rgb)
            if mesh.multi_face_landmarks:
                lm = mesh.multi_face_landmarks[0].landmark

                img_pts = np.array(
                    [(lm[i].x * w, lm[i].y * h) for i in LM_INDICES],
                    dtype=np.float64,
                )
                focal  = float(w)
                cam_mx = np.array(
                    [[focal, 0, w/2], [0, focal, h/2], [0, 0, 1]],
                    dtype=np.float64,
                )

                ok, rvec, _ = cv2.solvePnP(
                    MODEL_POINTS, img_pts, cam_mx, np.zeros((4,1)),
                    flags=cv2.SOLVEPNP_ITERATIVE,
                )

                if ok:
                    rmat, _ = cv2.Rodrigues(rvec)
                    angles, *_ = cv2.RQDecomp3x3(rmat)
                    yaw = angles[1]

                    if yaw > YAW_THRESHOLD:
                        status = f"NENGOK KANAN ({yaw:.1f} deg)"
                        color  = (0, 165, 255)
                    elif yaw < -YAW_THRESHOLD:
                        status = f"NENGOK KIRI ({abs(yaw):.1f} deg)"
                        color  = (0, 165, 255)
                    else:
                        status = f"OK (yaw {yaw:.1f} deg)"
                        color  = (0, 255, 0)

    # ── Tampilkan di frame ────────────────────────────────────────────────────
    cv2.rectangle(frame, (0, 0), (w, 40), (0, 0, 0), -1)
    cv2.putText(frame, status, (10, 28),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    cv2.imshow("Proctoring Test", frame)
    print(f"\r{status:<40}", end="", flush=True)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
print("\nSelesai.")
