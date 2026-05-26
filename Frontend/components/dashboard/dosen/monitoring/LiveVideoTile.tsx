"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { sendWebRtcSignal } from "@/services/ProctoringService";
import { getEcho } from "@/lib/echo";

interface Props {
  pesertaUjianId: number;
  nama: string | null;
  nim:  string | null;
}

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

export default function LiveVideoTile({ pesertaUjianId, nama, nim }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const pcRef       = useRef<RTCPeerConnection | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const okRef     = { current: false };
    const decodeSdp = (s: string) => { try { return atob(s); } catch { return s; } };
    const fixSdp    = (sdp: string) =>
      window.location.hostname !== "localhost" ? sdp :
      sdp.replace(/[\w-]+\.local/g, "127.0.0.1");
    const waitIceGather = (pc: RTCPeerConnection, ms: number) => new Promise<void>(resolve => {
      if (pc.iceGatheringState === "complete") { resolve(); return; }
      const t = setTimeout(resolve, ms);
      pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") { clearTimeout(t); resolve(); } };
    });

    const connect = async (offerSdp: string) => {
      if (okRef.current) return;
      pcRef.current?.close();
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      pc.ontrack = (e) => {
        if (videoRef.current) {
          const s = e.streams?.[0] ?? new MediaStream([e.track]);
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
          setConnected(true);
          okRef.current = true;
        }
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" && okRef.current) {
          okRef.current = false;
          setConnected(false);
          if (videoRef.current) videoRef.current.srcObject = null;
        }
      };
      await pc.setRemoteDescription({ type: "offer", sdp: fixSdp(decodeSdp(offerSdp)) });
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitIceGather(pc, 2000);
      sendWebRtcSignal({ peserta_ujian_id: pesertaUjianId, type: "answer", from: "dosen", sdp: btoa(fixSdp(pc.localDescription!.sdp)) }).catch(() => {});
    };

    const echo = getEcho();
    if (echo) {
      const ch = echo.channel(`proctoring-signal.${pesertaUjianId}`);
      ch.listen(".webrtc-signal", async (msg: { type: string; from: string; sdp?: string }) => {
        if (msg.from !== "student") return;
        if (msg.type === "offer" && msg.sdp && !okRef.current) connect(msg.sdp);
      });
    }

    const initialId = setTimeout(() => {
      if (!okRef.current) sendWebRtcSignal({ peserta_ujian_id: pesertaUjianId, type: "watch-request", from: "dosen" }).catch(() => {});
    }, 1000);
    const retryId = setInterval(() => {
      if (!okRef.current) sendWebRtcSignal({ peserta_ujian_id: pesertaUjianId, type: "watch-request", from: "dosen" }).catch(() => {});
    }, 4000);

    return () => {
      clearTimeout(initialId);
      clearInterval(retryId);
      if (echo) echo.leaveChannel(`proctoring-signal.${pesertaUjianId}`);
      pcRef.current?.close();
      pcRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pesertaUjianId]);

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <video
        ref={videoRef}
        autoPlay playsInline muted
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {!connected && (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <User size={18} className="text-gray-500" />
          </div>
          <span className="text-[10px] text-gray-500 animate-pulse">Menghubungkan...</span>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-6 pb-2">
        <p className="text-[11px] font-semibold text-white truncate leading-tight">{nama ?? "-"}</p>
        <p className="text-[9px] text-white/50">{nim ?? "-"}</p>
      </div>

      {connected && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] text-white font-medium">LIVE</span>
        </div>
      )}
    </div>
  );
}
