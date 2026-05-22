"use client";

import { useEffect, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";
import { logPelanggaran, logPelanggaranWithFoto } from "@/services/ProctoringService";

const WS_BASE = process.env.NEXT_PUBLIC_PROCTORING_WS_URL ?? "";
const FRAME_INTERVAL_MS = 5000;

interface Props {
  pesertaUjianId: number;
  onViolation?: (type: string, detail: Record<string, unknown>) => void;
  onCaptureReady?: (fn: () => Blob | null) => void;
}

export default function ProctoringCamera({ pesertaUjianId, onViolation, onCaptureReady }: Props) {
  const videoRef        = useRef<HTMLVideoElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const wsRef           = useRef<WebSocket | null>(null);
  const onViolationRef  = useRef(onViolation);
  const lastFrameRef    = useRef<Blob | null>(null);
  const [active, setActive] = useState(false);
  const [denied, setDenied] = useState(false);

  onViolationRef.current = onViolation;

  const snapshotToBlob = (): Blob | null => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return null;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: "image/jpeg" });
  };

  // Returns the most recently cached frame — safe to call even when tab is hidden
  const captureFrame = (): Blob | null => lastFrameRef.current;

  useEffect(() => {
    onCaptureReady?.(captureFrame);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let deniedIntervalId: ReturnType<typeof setInterval> | null = null;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
        setActive(true);
      })
      .catch(() => {
        setDenied(true);
        deniedIntervalId = setInterval(() => {
          logPelanggaran(pesertaUjianId, "no_face");
        }, FRAME_INTERVAL_MS);
      });

    const ws = new WebSocket(`${WS_BASE}/ws/proctoring/${pesertaUjianId}`);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data as string);
        if (data.type === "frame_result" && data.events?.length) {
          data.events.forEach((ev: { type: string; detail: Record<string, unknown> }) => {
            onViolationRef.current?.(ev.type, ev.detail);
            const foto = lastFrameRef.current;
            if (foto) {
              logPelanggaranWithFoto(pesertaUjianId, ev.type, foto);
            } else {
              logPelanggaran(pesertaUjianId, ev.type);
            }
          });
        }
      } catch (_) {}
    };

    const intervalId = setInterval(() => {
      const blob = snapshotToBlob();
      if (blob) lastFrameRef.current = blob;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !video.videoWidth) return;
      const frame = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
      ws.send(JSON.stringify({ frame, timestamp: new Date().toISOString() }));
    }, FRAME_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      if (deniedIntervalId) clearInterval(deniedIntervalId);
      stream?.getTracks().forEach(t => t.stop());
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: "end_session" }));
      }
      ws.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pesertaUjianId]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-1.5">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div
        className="relative rounded-xl overflow-hidden shadow-lg border-2"
        style={{
          borderColor: denied ? "#ef4444" : active ? "var(--color-primary)" : "#d1d5db",
          width: 320, height: 305,
        }}
      >
        {denied ? (
          <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center gap-1">
            <VideoOff size={22} className="text-red-400" />
            <span className="text-[10px] text-red-400">Kamera ditolak</span>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay muted playsInline
              width={220} height={185}
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {!active && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <Video size={22} className="text-gray-400 animate-pulse" />
              </div>
            )}
          </>
        )}

        {active && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] text-white font-medium">LIVE</span>
          </div>
        )}

        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
          <span className="text-[9px] text-white/70 font-medium bg-black/40 rounded px-2 py-0.5">Proctoring</span>
        </div>
      </div>
    </div>
  );
}
