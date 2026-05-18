"use client";

import { useEffect, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";

export default function ProctoringCamera() {
  const videoRef            = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
        setActive(true);
      })
      .catch(() => setDenied(true));

    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  return (
    <div className="fixed bottom-6 z-50 flex flex-col items-center gap-1.5" style={{ left: 312 }}>
      <div
        className="relative rounded-xl overflow-hidden shadow-lg border-2"
        style={{
          borderColor: denied ? "#ef4444" : active ? "var(--color-primary)" : "#d1d5db",
          width: 220, height: 205,
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
