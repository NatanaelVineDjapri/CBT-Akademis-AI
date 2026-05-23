"use client";

import { useEffect, useRef, useState } from "react";
import { Video, VideoOff, Monitor } from "lucide-react";
import { logPelanggaran, logPelanggaranWithFoto, sendWebRtcSignal, storeWebRtcOffer } from "@/services/ProctoringService";
import { getEcho } from "@/lib/echo";

const WS_BASE = process.env.NEXT_PUBLIC_PROCTORING_WS_URL ?? "";
const FRAME_INTERVAL_MS = 5000;
const ICE_TIMEOUT = 500;
const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

interface Props {
  pesertaUjianId: number;
  onViolation?: (type: string, detail: Record<string, unknown>) => void;
  onCaptureReady?: (fn: () => Blob | null) => void;
  onScreenShareReady?: (fn: () => Promise<void>) => void;
}

const waitIce = (pc: RTCPeerConnection) => new Promise<void>(resolve => {
  if (pc.iceGatheringState === "complete") { resolve(); return; }
  const t = setTimeout(resolve, ICE_TIMEOUT);
  pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") { clearTimeout(t); resolve(); } };
});

const decodeSdp = (s: string) => { try { return atob(s); } catch { return s; } };

export default function ProctoringCamera({ pesertaUjianId, onViolation, onCaptureReady, onScreenShareReady }: Props) {
  const videoRef           = useRef<HTMLVideoElement>(null);
  const canvasRef          = useRef<HTMLCanvasElement>(null);
  const wsRef              = useRef<WebSocket | null>(null);
  const onViolationRef     = useRef(onViolation);
  const lastFrameRef       = useRef<Blob | null>(null);
  const streamRef          = useRef<MediaStream | null>(null);
  const pcRef              = useRef<RTCPeerConnection | null>(null);
  const screenStreamRef    = useRef<MediaStream | null>(null);
  const screenPcRef        = useRef<RTCPeerConnection | null>(null);
  const prewarmPcRef       = useRef<RTCPeerConnection | null>(null);
  const screenPrewarmPcRef = useRef<RTCPeerConnection | null>(null);

  const [active, setActive]           = useState(false);
  const [denied, setDenied]           = useState(false);
  const [screenShared, setScreenShared] = useState(false);

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

  const captureFrame = (): Blob | null => lastFrameRef.current;

  // Pre-create a PC + offer and cache it on the server so dosen can fetch instantly
  const prewarmCam = async () => {
    if (!streamRef.current) return;
    prewarmPcRef.current?.close();
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    streamRef.current.getTracks().forEach(t => pc.addTrack(t, streamRef.current!));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitIce(pc);
    prewarmPcRef.current = pc;
    storeWebRtcOffer(pesertaUjianId, btoa(pc.localDescription!.sdp), "cam").catch(() => {});
  };

  const prewarmScreen = async () => {
    if (!screenStreamRef.current) return;
    screenPrewarmPcRef.current?.close();
    const spc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    screenStreamRef.current.getTracks().forEach(t => spc.addTrack(t, screenStreamRef.current!));
    const offer = await spc.createOffer();
    await spc.setLocalDescription(offer);
    await waitIce(spc);
    screenPrewarmPcRef.current = spc;
    storeWebRtcOffer(pesertaUjianId, btoa(spc.localDescription!.sdp), "screen").catch(() => {});
  };

  const startScreenShare = async () => {
    if (screenStreamRef.current?.active) return;
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = s;
      setScreenShared(true);
      s.getVideoTracks()[0].onended = () => {
        screenStreamRef.current = null;
        setScreenShared(false);
        screenPrewarmPcRef.current?.close();
        screenPrewarmPcRef.current = null;
      };
      prewarmScreen();
    } catch { /* user cancelled */ }
  };

  useEffect(() => {
    onCaptureReady?.(captureFrame);
    onScreenShareReady?.(startScreenShare);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let deniedIntervalId: ReturnType<typeof setInterval> | null = null;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(s => {
        stream = s;
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
        setActive(true);
        prewarmCam();
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
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: "end_session" }));
      ws.close();
      prewarmPcRef.current?.close();
      prewarmPcRef.current = null;
      screenPrewarmPcRef.current?.close();
      screenPrewarmPcRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pesertaUjianId]);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;
    const ch = echo.channel(`proctoring-signal.${pesertaUjianId}`);

    ch.listen(".webrtc-signal", async (msg: { type: string; from: string; sdp?: string }) => {
      if (msg.from !== "dosen") return;

      if (msg.type === "watch-request") {
        pcRef.current?.close();
        let pc: RTCPeerConnection;
        let sdp: string;

        if (prewarmPcRef.current?.localDescription) {
          // Gunakan pre-warmed PC langsung — nol delay
          pc  = prewarmPcRef.current;
          prewarmPcRef.current = null;
          sdp = btoa(pc.localDescription!.sdp);
          prewarmCam(); // mulai prewarm berikutnya di background
        } else {
          // Fallback: buat fresh PC
          pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
          streamRef.current?.getTracks().forEach(t => pc.addTrack(t, streamRef.current!));
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await waitIce(pc);
          sdp = btoa(pc.localDescription!.sdp);
          storeWebRtcOffer(pesertaUjianId, sdp, "cam").catch(() => {});
        }
        pcRef.current = pc;
        sendWebRtcSignal({ peserta_ujian_id: pesertaUjianId, type: "offer", from: "student", sdp }).catch(() => {});

      } else if (msg.type === "watch-screen-request") {
        if (!screenStreamRef.current) return;
        screenPcRef.current?.close();
        let spc: RTCPeerConnection;
        let sdp: string;

        if (screenPrewarmPcRef.current?.localDescription) {
          spc = screenPrewarmPcRef.current;
          screenPrewarmPcRef.current = null;
          sdp = btoa(spc.localDescription!.sdp);
          prewarmScreen();
        } else {
          spc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
          screenStreamRef.current.getTracks().forEach(t => spc.addTrack(t, screenStreamRef.current!));
          const offer = await spc.createOffer();
          await spc.setLocalDescription(offer);
          await waitIce(spc);
          sdp = btoa(spc.localDescription!.sdp);
          storeWebRtcOffer(pesertaUjianId, sdp, "screen").catch(() => {});
        }
        screenPcRef.current = spc;
        sendWebRtcSignal({ peserta_ujian_id: pesertaUjianId, type: "screen-offer", from: "student", sdp }).catch(() => {});

      } else if (msg.type === "answer" && msg.sdp) {
        const sdp = decodeSdp(msg.sdp);
        // answer bisa untuk pcRef (via watch-request) atau prewarmPcRef (via backend cache)
        const target = pcRef.current ?? prewarmPcRef.current;
        if (target) {
          if (target === prewarmPcRef.current) {
            pcRef.current = target;
            prewarmPcRef.current = null;
          }
          await target.setRemoteDescription({ type: "answer", sdp });
        }

      } else if (msg.type === "screen-answer" && msg.sdp) {
        const sdp = decodeSdp(msg.sdp);
        const target = screenPcRef.current ?? screenPrewarmPcRef.current;
        if (target) {
          if (target === screenPrewarmPcRef.current) {
            screenPcRef.current = target;
            screenPrewarmPcRef.current = null;
          }
          await target.setRemoteDescription({ type: "answer", sdp });
        }
      }
    });

    return () => {
      echo.leaveChannel(`proctoring-signal.${pesertaUjianId}`);
      pcRef.current?.close();       pcRef.current = null;
      screenPcRef.current?.close(); screenPcRef.current = null;
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

      {screenShared && (
        <div className="w-full rounded-xl bg-white border border-gray-100 shadow px-3 py-2 flex items-center gap-2">
          <Monitor size={12} style={{ color: "var(--color-primary)" }} />
          <span className="text-[11px] font-medium" style={{ color: "var(--color-primary)" }}>Layar sedang dibagikan</span>
        </div>
      )}
    </div>
  );
}
