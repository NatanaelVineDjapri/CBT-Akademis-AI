"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Maximize } from "lucide-react";
import { logPelanggaran, logPelanggaranWithFoto } from "@/services/ProctoringService";

type ViolationType = "tab" | "fullscreen" | "copypaste" | "screenshot";

const MESSAGES: Record<ViolationType, string> = {
  tab:        "Terdeteksi pindah tab atau jendela browser!",
  fullscreen: "Kamu keluar dari mode fullscreen!",
  copypaste:  "Terdeteksi aksi copy/paste!",
  screenshot: "Terdeteksi percobaan screenshot!",
};

const MAX_TAB_VIOLATIONS = 5;

const enterFullscreen = () =>
  document.documentElement.requestFullscreen?.().catch(() => {});

export default function ProctoringMonitor({
  pesertaUjianId,
  onAutoSubmit,
  captureFrame,
  startScreenShare,
  submitting = false,
}: {
  pesertaUjianId: number;
  onAutoSubmit: () => void;
  captureFrame?: () => Blob | null;
  startScreenShare?: () => Promise<void>;
  submitting?: boolean;
}) {
  const [warning, setWarning]   = useState<ViolationType | null>(null);
  const [needFs, setNeedFs]     = useState(!document.fullscreenElement);
  const [tabCount, setTabCount] = useState(0);
  const tabCountRef              = useRef(0);
  const onAutoSubmitRef          = useRef(onAutoSubmit);
  onAutoSubmitRef.current        = onAutoSubmit;

  const trigger = (type: ViolationType) => {
    const foto = captureFrame?.();
    if (foto) {
      logPelanggaranWithFoto(pesertaUjianId, type, foto);
    } else {
      logPelanggaran(pesertaUjianId, type);
    }
    if (type === "tab") {
      tabCountRef.current += 1;
      setTabCount(tabCountRef.current);
      if (tabCountRef.current >= MAX_TAB_VIOLATIONS) { onAutoSubmitRef.current(); return; }
    }
    setWarning(type);
  };

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setNeedFs(true);
        trigger("fullscreen");
      } else {
        setNeedFs(false);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  // Tab / window switch — deteksi pindah tab (visibilitychange) DAN pindah aplikasi/window
  // lain seperti File Explorer (window blur). Dedup biar tab switch yang men-trigger dua
  // event sekaligus ga kehitung dobel.
  useEffect(() => {
    let lastLeave = 0;
    const onLeave = () => {
      if (!document.fullscreenElement) return;
      const now = Date.now();
      if (now - lastLeave < 1000) return; // dedup dalam 1 detik
      lastLeave = now;
      trigger("tab");
    };
    const onVisibility = () => { if (document.hidden) onLeave(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  // Copy / paste / cut / right-click block
  useEffect(() => {
    const block    = (e: Event) => { e.preventDefault(); trigger("copypaste"); };
    const blockCtx = (e: Event) => e.preventDefault();
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", blockCtx);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", blockCtx);
    };
  }, []);

  // Screenshot detection
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        trigger("screenshot");
      }
      // Windows Snipping Tool: Win+Shift+S
      if (e.shiftKey && e.metaKey && e.key === "s") {
        e.preventDefault();
        trigger("screenshot");
      }
    };
    const onPrint = () => { trigger("screenshot"); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("beforeprint", onPrint);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("beforeprint", onPrint);
    };
  }, []);

  if (submitting) return null;

  // Fullscreen entry prompt — harus user gesture
  if (needFs) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <Maximize size={28} className="text-blue-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Mode Fullscreen Diperlukan</h3>
          <p className="text-sm text-gray-500">Ujian ini wajib dijalankan dalam mode fullscreen. Klik tombol di bawah untuk melanjutkan.</p>
        </div>
        <button
          onClick={() => {
            enterFullscreen();
            setNeedFs(false);
          }}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Masuk Fullscreen & Mulai Ujian
        </button>
      </div>
    </div>
  );

  // Violation warning
  if (warning) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Peringatan Proctoring</h3>
          <p className="text-sm text-gray-600">{MESSAGES[warning]}</p>
          <p className="text-xs text-red-500 font-medium mt-2">
            Pelanggaran Telah Terjadi! Aktivitas ini dicatat.
          </p>
          {warning === "tab" && (
            <p className="text-xs text-orange-500 font-medium mt-1">
              Peringatan tab: {tabCount}/{MAX_TAB_VIOLATIONS} , ujian otomatis dikumpulkan jika batas tercapai.
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setWarning(null);
            if (warning === "fullscreen") enterFullscreen();
          }}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {warning === "fullscreen" ? "Kembali Fullscreen" : "Saya Mengerti"}
        </button>
      </div>
    </div>
  );

  return null;
}
