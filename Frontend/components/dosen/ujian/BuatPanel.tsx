"use client";

import useSWR from "swr";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/services/api";
import { JENIS_OPTIONS, KESULITAN_OPTIONS, OPSI_KEYS, inputCls, labelCls } from "./constants";
import type { BabOption, BankSoalOption, LocalSoalItem } from "./types";

export default function BuatPanel({
  mode, ujianId, matkulId, babs, onSaved, onAdd, onClose, apiPath = "/ujian/dosen",
}: {
  mode: "create" | "edit";
  ujianId?: string;
  matkulId?: number;
  babs: BabOption[];
  onSaved?: () => void;
  onAdd?: (items: LocalSoalItem[]) => void;
  onClose: () => void;
  apiPath?: string;
}) {
  const [jenisSoal, setJenisSoal]               = useState("pilihan_ganda");
  const [kesulitan, setKesulitan]               = useState("sedang");
  const [deskripsi, setDeskripsi]               = useState("");
  const [babId, setBabId]                       = useState<number | "">("");
  const [opsi, setOpsi]                         = useState({ A: "", B: "", C: "", D: "" });
  const [kunci, setKunci]                       = useState<string[]>([]);
  const [simpanKeBankSoal, setSimpanKeBankSoal] = useState(false);
  const [bankSoalId, setBankSoalId]             = useState<number | "">("");
  const [saving, setSaving]                     = useState(false);
  const [error, setError]                       = useState("");

  const { data: bankSoalData } = useSWR(
    simpanKeBankSoal ? ["/bank-soal/buat-panel", matkulId ?? "all"] : null,
    () => api.get("/bank-soal", { params: { ...(matkulId ? { mata_kuliah_id: matkulId } : {}), per_page: 100 } }).then(r => r.data.data ?? []),
    { revalidateOnFocus: false },
  );
  const bankSoalOptions: BankSoalOption[] = bankSoalData ?? [];

  const toggleKunci = (huruf: string) => {
    if (jenisSoal === "pilihan_ganda") setKunci([huruf]);
    else setKunci(prev => prev.includes(huruf) ? prev.filter(k => k !== huruf) : [...prev, huruf]);
  };

  const handleSave = async () => {
    if (!deskripsi.trim()) { setError("Deskripsi wajib diisi."); return; }
    if (jenisSoal !== "essay") {
      if (Object.values(opsi).some(v => !v.trim())) { setError("Semua opsi jawaban wajib diisi."); return; }
      if (kunci.length === 0) { setError("Pilih minimal satu jawaban benar."); return; }
    }
    if (simpanKeBankSoal && !bankSoalId) { setError("Pilih bank soal tujuan."); return; }
    setSaving(true); setError("");

    const payload = {
      jenis_soal:          jenisSoal,
      tingkat_kesulitan:   kesulitan,
      deskripsi,
      bab_id:              babId || null,
      opsi:                jenisSoal !== "essay" ? opsi : undefined,
      kunci:               jenisSoal !== "essay"
        ? (jenisSoal === "pilihan_ganda" ? kunci[0] : kunci)
        : undefined,
      simpan_ke_bank_soal: simpanKeBankSoal,
      bank_soal_id:        simpanKeBankSoal ? Number(bankSoalId) : null,
    };

    try {
      if (mode === "create") {
        const localId = `new_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const babName = babs.find(b => b.id === babId)?.nama_bab ?? null;
        onAdd?.([{
          _localId:          localId,
          bobot:             1.0,
          deskripsi,
          jenis_soal:        jenisSoal,
          tingkat_kesulitan: kesulitan,
          bab:               babName,
          bab_id:            babId || null,
          opsi:              jenisSoal !== "essay" ? { ...opsi } : undefined,
          kunci:             jenisSoal !== "essay"
            ? (jenisSoal === "pilihan_ganda" ? kunci[0] : [...kunci])
            : undefined,
          bank_soal_id:      simpanKeBankSoal && bankSoalId ? Number(bankSoalId) : null,
        }]);
        onClose();
      } else {
        await api.post(`${apiPath}/${ujianId}/soal/buat-baru`, payload);
        onSaved?.();
        onClose();
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal menyimpan soal.");
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="overflow-y-auto flex-1 p-5 space-y-4">
        <div>
          <label className={labelCls}>Jenis Soal</label>
          <div className="flex gap-2">
            {JENIS_OPTIONS.map(o => (
              <button key={o.value} type="button"
                onClick={() => { setJenisSoal(o.value); setKunci([]); }}
                className="flex-1 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors"
                style={jenisSoal === o.value
                  ? { backgroundColor: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }
                  : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Pertanyaan</label>
          <textarea rows={3} value={deskripsi} onChange={e => setDeskripsi(e.target.value)}
            placeholder="Tulis pertanyaan di sini..." className={inputCls + " resize-none"} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Tingkat Kesulitan</label>
            <select value={kesulitan} onChange={e => setKesulitan(e.target.value)} className={inputCls}>
              {KESULITAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Bab <span className="text-gray-400 normal-case font-normal">(opsional)</span></label>
            <select value={babId} onChange={e => setBabId(e.target.value ? Number(e.target.value) : "")} className={inputCls}>
              <option value="">— Pilih Bab —</option>
              {babs.map(b => <option key={b.id} value={b.id}>{b.nama_bab}</option>)}
            </select>
          </div>
        </div>

        {jenisSoal !== "essay" && (
          <div>
            <label className={labelCls}>
              Opsi Jawaban
              <span className="text-gray-400 normal-case font-normal ml-1">
                ({jenisSoal === "pilihan_ganda" ? "klik huruf untuk pilih jawaban benar" : "bisa lebih dari 1 jawaban benar"})
              </span>
            </label>
            <div className="space-y-2">
              {OPSI_KEYS.map(huruf => {
                const isKunci = kunci.includes(huruf);
                return (
                  <div key={huruf} className="flex items-center gap-2">
                    <button type="button" onClick={() => toggleKunci(huruf)}
                      className="w-7 h-7 rounded-full text-xs font-bold shrink-0 border-2 transition-colors cursor-pointer"
                      style={isKunci
                        ? { backgroundColor: "var(--color-primary)", borderColor: "var(--color-primary)", color: "white" }
                        : { borderColor: "#e5e7eb", color: "#9ca3af" }}>
                      {huruf}
                    </button>
                    <input type="text"
                      value={opsi[huruf as keyof typeof opsi]}
                      onChange={e => setOpsi(prev => ({ ...prev, [huruf]: e.target.value }))}
                      placeholder={`Opsi ${huruf}`}
                      className={inputCls}
                      style={isKunci ? { borderColor: "var(--color-primary)" } : {}} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" className="accent-[var(--color-primary)] w-4 h-4"
              checked={simpanKeBankSoal} onChange={e => setSimpanKeBankSoal(e.target.checked)} />
            <span className="text-sm text-gray-700 font-medium">Simpan ke bank soal juga</span>
          </label>
          {simpanKeBankSoal && (
            <div className="mt-3">
              <label className={labelCls}>Bank Soal Tujuan</label>
              <select value={bankSoalId} onChange={e => setBankSoalId(e.target.value ? Number(e.target.value) : "")} className={inputCls}>
                <option value="">— Pilih Bank Soal —</option>
                {bankSoalOptions.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select>
              {bankSoalOptions.length === 0 && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Belum ada bank soal untuk mata kuliah ini. Buat dulu di halaman Bank Soal.
                </p>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
        <button onClick={onClose}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
          Batal
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {saving ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</> : "Simpan Soal"}
        </button>
      </div>
    </>
  );
}
