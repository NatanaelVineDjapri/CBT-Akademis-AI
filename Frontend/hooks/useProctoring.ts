// hooks/useProctoring.ts
// Tinggal dipanggil di halaman ujian Next.js lu
 
import { useEffect, useRef, useCallback } from "react";
 
interface ProctoringEvent {
  type: "no_face" | "multiple_faces" | "looking_away";
  timestamp: string;
  detail: Record<string, unknown>;
}
 
interface FrameResult {
  type: "frame_result";
  face_count: number;
  events: ProctoringEvent[];
  risk_score: number;
}
 
interface SessionEnded {
  type: "session_ended";
  summary: {
    risk_score: number;
    total_events: number;
    event_breakdown: Record<string, number>;
    events: ProctoringEvent[];
  };
}
 
interface UseProctoringOptions {
  examId: string;
  userId: string;
  wsUrl?: string;
  /** Interval kirim frame ke server (ms). Default 1000 */
  captureInterval?: number;
  /** Callback tiap ada event kecurangan */
  onEvent?: (events: ProctoringEvent[], riskScore: number) => void;
  /** Callback saat sesi selesai dan summary sudah diterima dari server */
  onSessionEnded?: (summary: SessionEnded["summary"]) => void;
}
 
export function useProctoring({
  examId,
  userId,
  wsUrl = "ws://localhost:8001",
  captureInterval = 1000,
  onEvent,
  onSessionEnded,
}: UseProctoringOptions) {
  const wsRef        = useRef<WebSocket | null>(null);
  const videoRef     = useRef<HTMLVideoElement | null>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef    = useRef<MediaStream | null>(null);
 
  // ── Buka kamera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async (videoEl: HTMLVideoElement) => {
    videoRef.current  = videoEl;
    const stream      = await navigator.mediaDevices.getUserMedia({ video: true });
    videoEl.srcObject = stream;
    streamRef.current = stream;
    await videoEl.play();
  }, []);
 
  // ── Ambil 1 frame dan kirim ke WS ────────────────────────────────────────
  const captureAndSend = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    const ws     = wsRef.current;
 
    if (!video || !ws || ws.readyState !== WebSocket.OPEN) return;
 
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
 
    // Kirim sebagai base64 JPEG (lebih kecil dari PNG)
    const frame = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
    ws.send(JSON.stringify({ frame, timestamp: new Date().toISOString() }));
  }, []);
 
  // ── Start session ─────────────────────────────────────────────────────────
  const startSession = useCallback(
    (videoEl: HTMLVideoElement) => {
      startCamera(videoEl);
 
      const ws = new WebSocket(`${wsUrl}/ws/proctoring/${examId}/${userId}`);
      wsRef.current = ws;
 
      ws.onopen = () => {
        console.log("[Proctoring] WebSocket connected");
        intervalRef.current = setInterval(captureAndSend, captureInterval);
      };
 
      ws.onmessage = (evt) => {
        const data: FrameResult | SessionEnded = JSON.parse(evt.data);
 
        if (data.type === "frame_result" && data.events.length > 0) {
          onEvent?.(data.events, data.risk_score);
        }
 
        if (data.type === "session_ended") {
          onSessionEnded?.(data.summary);
        }
      };
 
      ws.onerror = (err) => console.error("[Proctoring] WS error", err);
      ws.onclose = ()  => console.log("[Proctoring] WS closed");
    },
    [examId, userId, wsUrl, captureInterval, startCamera, captureAndSend, onEvent, onSessionEnded]
  );
 
  // ── End session (panggil saat ujian selesai) ──────────────────────────────
  const endSession = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
 
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: "end_session" }));
      // ws akan ditutup dari server setelah summary dikirim
    }
 
    // Matikan kamera
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);
 
  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      wsRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
 
  return { startSession, endSession };
}
 
// ── Contoh pemakaian di halaman ujian ────────────────────────────────────────
/*
"use client";
import { useRef } from "react";
import { useProctoring } from "@/hooks/useProctoring";
 
export default function ExamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
 
  const { startSession, endSession } = useProctoring({
    examId: "exam-123",
    userId: "user-456",
    captureInterval: 1000,
    onEvent: (events, riskScore) => {
      console.log("Kecurangan terdeteksi:", events, "Risk:", riskScore);
      // Tampilkan notif ke peserta / simpan di state
    },
    onSessionEnded: (summary) => {
      console.log("Summary sesi:", summary);
      // summary sudah di-push ke Laravel oleh server
    },
  });
 
  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onLoadedMetadata={() => {
          if (videoRef.current) startSession(videoRef.current);
        }}
        style={{ width: 320, height: 240 }}
      />
      <button onClick={endSession}>Selesai Ujian</button>
    </div>
  );
}
*/