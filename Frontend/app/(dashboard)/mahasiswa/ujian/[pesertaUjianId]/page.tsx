"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ProctoringCamera from "@/components/dashboard/mahasiswa/ujian/ProctoringCamera";
import ProctoringMonitor from "@/components/dashboard/mahasiswa/ujian/ProctoringMonitor";
import UjianSoalSkeleton from "@/components/skeleton/UjianSoalSkeleton";
import { mulaiUjian, submitJawabanSoal, selesaikanUjian } from "@/services/UjianServices";
import type { UjianSession, SoalItem } from "@/types";
import { formatDate, formatTime } from "@/utils/format";

type Phase = "loading" | "kode" | "exam" | "submitting" | "error";

function formatTimer(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function UjianPage({ params }: { params: Promise<{ pesertaUjianId: string }> }) {
  const { pesertaUjianId } = use(params);
  const id = Number(pesertaUjianId);
  const router = useRouter();

  const [phase, setPhase]             = useState<Phase>("loading");
  const [session, setSession]         = useState<UjianSession | null>(null);
  const [errorMsg, setErrorMsg]       = useState("");
  const [kode, setKode]               = useState("");
  const [kodeError, setKodeError]     = useState("");
  const [kodeLoading, setKodeLoading] = useState(false);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [jawaban, setJawaban]         = useState<Record<number, string>>({});
  const [saving, setSaving]           = useState<Set<number>>(new Set());
  const [saved,  setSaved]            = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft]       = useState<number | null>(null);
  const [confirmSelesai, setConfirmSelesai] = useState(false);
  const selesaiRef      = useRef(false);
  const essayTimers     = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const captureFrameRef    = useRef<(() => Blob | null) | null>(null);
  const startScreenShareRef = useRef<(() => Promise<void>) | null>(null);

  const applySession = (s: UjianSession) => {
    const init: Record<number, string> = {};
    const initSaved = new Set<number>();
    s.soal.forEach(soal => {
      if (soal.jawaban) {
        init[soal.ujian_soal_id] = soal.jawaban;
        initSaved.add(soal.ujian_soal_id);
      }
    });
    setJawaban(init);
    setSaved(initSaved);
    setSession(s);
    setPhase("exam");
  };

  const doMulai = useCallback(async (kodeAkses?: string) => {
    try { applySession(await mulaiUjian(id, kodeAkses)); }
    catch (err: any) {
      if (err?.response?.data?.errors?.kode_akses) { setPhase("kode"); }
      else { setErrorMsg(err?.response?.data?.message ?? "Gagal memulai ujian."); setPhase("error"); }
    }
  }, [id]);

  useEffect(() => { doMulai(); }, [doMulai]);

  const handleKodeSubmit = async () => {
    if (!kode.trim()) return;
    setKodeLoading(true); setKodeError("");
    try { applySession(await mulaiUjian(id, kode.trim())); }
    catch (err: any) { setKodeError(err?.response?.data?.message ?? "Kode salah, coba lagi."); }
    finally { setKodeLoading(false); }
  };

  useEffect(() => {
    if (!session || phase !== "exam") return;
    const endMs = new Date(session.end_at).getTime();
    const tick = () => {
      const left = Math.max(0, Math.floor((endMs - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0 && !selesaiRef.current) handleAutoSelesai();
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, phase]);

  const handleAutoSelesai = async () => {
    if (selesaiRef.current || !session) return;
    selesaiRef.current = true; setPhase("submitting");
    try { await selesaikanUjian(session.peserta_ujian_id); } finally { window.location.href = "/mahasiswa/ujian?tab=selesai"; }
  };

  const handleSelesai = async () => {
    if (!session) return;
    selesaiRef.current = true; setConfirmSelesai(false); setPhase("submitting");
    try { await selesaikanUjian(session.peserta_ujian_id); window.location.href = "/mahasiswa/ujian?tab=selesai"; }
    catch { selesaiRef.current = false; setPhase("exam"); }
  };

  const saveJawaban = async (soal: SoalItem, value: string) => {
    if (!session) return;
    setSaving(p => new Set(p).add(soal.ujian_soal_id));
    try {
      await submitJawabanSoal(session.peserta_ujian_id, soal.ujian_soal_id, value);
      if (value) {
        setSaved(p => new Set(p).add(soal.ujian_soal_id));
      } else {
        setSaved(p => { const n = new Set(p); n.delete(soal.ujian_soal_id); return n; });
      }
    } finally {
      setSaving(p => { const n = new Set(p); n.delete(soal.ujian_soal_id); return n; });
    }
  };

  const handlePG = (soal: SoalItem, opsi: string) => {
    const isSameOpsi = jawaban[soal.ujian_soal_id] === opsi;
    const value = isSameOpsi ? "" : opsi;
    setJawaban(p => ({ ...p, [soal.ujian_soal_id]: value }));
    saveJawaban(soal, value);
  };

  const handleChecklist = (soal: SoalItem, opsi: string, checked: boolean) => {
    const cur  = (jawaban[soal.ujian_soal_id] ?? "").split(",").filter(Boolean);
    const next = checked ? [...cur, opsi] : cur.filter(x => x !== opsi);
    const val  = next.join(",");
    setJawaban(p => ({ ...p, [soal.ujian_soal_id]: val }));
    saveJawaban(soal, val);
  };

  const handleEssay = (soal: SoalItem, value: string) => {
    setJawaban(p => ({ ...p, [soal.ujian_soal_id]: value }));
    clearTimeout(essayTimers.current[soal.ujian_soal_id]);
    essayTimers.current[soal.ujian_soal_id] = setTimeout(() => saveJawaban(soal, value), 800);
  };

  // ── Loading / Error / Kode ───────────────────────────────────────────────────

  if (phase === "loading" || phase === "submitting") return <UjianSoalSkeleton />;

  if (phase === "error") return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertTriangle size={36} className="text-red-400" />
      <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
      <button onClick={() => router.push("/mahasiswa/ujian")} className="text-xs text-gray-400 hover:underline">Kembali</button>
    </div>
  );

  if (phase === "kode") return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Kode Akses Ujian</h2>
          <p className="text-xs text-gray-400 mt-1">Ujian ini memerlukan kode akses dari dosen.</p>
        </div>
        <input type="text" value={kode} autoFocus
          onChange={e => setKode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && handleKodeSubmit()}
          placeholder="Masukkan kode..."
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm uppercase tracking-widest focus:outline-none focus:ring-2"
          style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
        />
        {kodeError && <p className="text-xs text-red-500">{kodeError}</p>}
        <button onClick={handleKodeSubmit} disabled={kodeLoading || !kode.trim()}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {kodeLoading ? <><Loader2 size={14} className="animate-spin" />Memverifikasi...</> : "Masuk"}
        </button>
        <button onClick={() => router.push("/mahasiswa/ujian")} className="text-xs text-gray-400 hover:underline text-center">Batal</button>
      </div>
    </div>
  );

  // ── Exam ─────────────────────────────────────────────────────────────────────
  if (!session) return null;

  const soal      = session.soal[currentIdx];
  const total     = session.soal.length;
  const answered  = (s: SoalItem) => !!jawaban[s.ujian_soal_id];
  const totalDone = session.soal.filter(answered).length;
  const belumJawab = total - totalDone;
  const isWarning  = timeLeft !== null && timeLeft < 300;
  const curJawaban = jawaban[soal.ujian_soal_id] ?? "";
  const isSaving   = saving.has(soal.ujian_soal_id);
  const isSaved    = saved.has(soal.ujian_soal_id);
  const isPending  = !isSaving && !isSaved && !!curJawaban && soal.jenis_soal === "essay";

  return (
    <div className="flex flex-col gap-4 pb-24">
      {session.proctoring_aktif && <ProctoringCamera pesertaUjianId={session.peserta_ujian_id} onCaptureReady={fn => { captureFrameRef.current = fn; }} onScreenShareReady={fn => { startScreenShareRef.current = fn; }} />}
      {session.proctoring_aktif && <ProctoringMonitor pesertaUjianId={session.peserta_ujian_id} onAutoSubmit={handleAutoSelesai} captureFrame={() => captureFrameRef.current?.() ?? null} startScreenShare={() => startScreenShareRef.current?.() ?? Promise.resolve()} submitting={confirmSelesai || selesaiRef.current} />}

      {/* ── Header ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-gray-800">{session.nama_ujian}</h2>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(session.mulai_at)}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{formatTime(session.mulai_at)} – {formatTime(session.end_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Terjawab</p>
              <p className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{totalDone}/{total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Waktu Tersisa</p>
              <div className={`font-mono font-bold text-xl px-3 py-1 rounded-lg ${isWarning ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}>
                {timeLeft !== null ? formatTimer(timeLeft) : "--:--"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigasi Soal ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Navigasi Soal</p>
        <div className="flex flex-wrap gap-1.5">
          {session.soal.map((s, i) => (
            <button key={s.ujian_soal_id} onClick={() => setCurrentIdx(i)}
              className="w-9 h-9 text-xs font-semibold rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={i === currentIdx
                ? { backgroundColor: "var(--color-primary)", color: "white" }
                : answered(s)
                ? { backgroundColor: "#dcfce7", color: "#16a34a" }
                : { backgroundColor: "#f3f4f6", color: "#6b7280" }}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Soal ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">Soal {currentIdx + 1} dari {total}</h3>
          <span className="text-xs text-gray-400 capitalize">{soal.jenis_soal.replace("_", " ")} · Bobot {soal.bobot}</span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{soal.deskripsi}</p>

        {/* Pilihan Ganda — 2 kolom */}
        {soal.jenis_soal === "pilihan_ganda" && (
          <div className="grid grid-cols-2 gap-3">
            {soal.opsi?.map(o => {
              const sel = curJawaban === o.opsi;
              return (
                <button key={o.opsi} onClick={() => handlePG(soal, o.opsi)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all cursor-pointer"
                  style={sel
                    ? { borderColor: "var(--color-primary)", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }
                    : { borderColor: "#e5e7eb", color: "#374151" }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={sel ? { backgroundColor: "var(--color-primary)", color: "white" } : { backgroundColor: "#f3f4f6", color: "#6b7280" }}>
                    {o.opsi}
                  </span>
                  {o.teks}
                </button>
              );
            })}
          </div>
        )}

        {/* Checklist — 2 kolom */}
        {soal.jenis_soal === "checklist" && (
          <div className="grid grid-cols-2 gap-3">
            {soal.opsi?.map(o => {
              const checked = curJawaban.split(",").filter(Boolean).includes(o.opsi);
              return (
                <button key={o.opsi} onClick={() => handleChecklist(soal, o.opsi, !checked)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all cursor-pointer"
                  style={checked
                    ? { borderColor: "var(--color-primary)", backgroundColor: "var(--color-primary-light)" }
                    : { borderColor: "#e5e7eb" }}>
                  <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                    style={checked ? { borderColor: "var(--color-primary)", backgroundColor: "var(--color-primary)" } : { borderColor: "#d1d5db" }}>
                    {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span style={checked ? { color: "var(--color-primary)" } : { color: "#374151" }}>{o.opsi}. {o.teks}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Essay */}
        {soal.jenis_soal === "essay" && (
          <textarea value={curJawaban} onChange={e => handleEssay(soal, e.target.value)}
            placeholder="Tuliskan jawaban kamu di sini..."
            rows={8}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
          />
        )}

        {/* Status simpan */}
        <div className="mt-3 h-4">
          {isSaving
            ? <p className="text-xs text-gray-400 flex items-center gap-1"><Loader2 size={11} className="animate-spin" />Menyimpan...</p>
            : isPending
            ? <p className="text-xs text-gray-400">Mengetik...</p>
            : isSaved
            ? <p className="text-xs text-green-500">✓ Jawaban tersimpan</p>
            : null}
        </div>

        {/* Navigasi prev/next */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
            className="flex items-center gap-1.5 text-sm text-gray-500 disabled:opacity-30 hover:text-gray-700 cursor-pointer">
            <ChevronLeft size={16} /> Sebelumnya
          </button>
          <span className="text-xs text-gray-400">Halaman {currentIdx + 1} dari {total}</span>
          <button onClick={() => setCurrentIdx(i => Math.min(total - 1, i + 1))} disabled={currentIdx === total - 1}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-white disabled:opacity-30 cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}>
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Floating Kumpul Jawaban ── */}
      <div className="fixed bottom-6 right-8 flex flex-col items-end gap-2 z-50">
        {belumJawab > 0 && (
          <p className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
            *Terdapat <span className="font-semibold text-red-500">{belumJawab} soal</span> yang belum dijawab
          </p>
        )}
        <button onClick={() => setConfirmSelesai(true)}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}>
          Kumpul Jawaban
        </button>
      </div>

      {confirmSelesai && (
        <ConfirmModal
          title="Kumpul Jawaban"
          message={belumJawab > 0
            ? `Masih ada ${belumJawab} soal yang belum dijawab. Yakin ingin mengumpulkan jawaban? Tindakan ini tidak bisa dibatalkan.`
            : `Semua soal sudah dijawab. Yakin ingin mengumpulkan jawaban?`}
          confirmLabel="Ya, Kumpul"
          loading={false}
          onConfirm={handleSelesai}
          onCancel={() => setConfirmSelesai(false)}
        />
      )}
    </div>
  );
}
