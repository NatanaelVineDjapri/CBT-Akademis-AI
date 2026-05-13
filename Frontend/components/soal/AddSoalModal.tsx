"use client";

import { useState, useRef } from "react";
import { X, Loader2, ImagePlus, Trash2 } from "lucide-react";
import useSWR from "swr";
import { getBabByMataKuliah, createSoal, updateSoal } from "@/services/BankSoalServices";
import { uploadSoalImage } from "@/services/UserServices";
import type { SoalItem } from "@/services/BankSoalServices";
import type { BankSoalItem } from "@/types";

const JENIS_OPTIONS = [
  { value: "pilihan_ganda", label: "Pilihan Ganda" },
  { value: "essay",         label: "Essay" },
  { value: "checklist",     label: "Checklist" },
];

const KESULITAN_OPTIONS = [
  { value: "mudah",  label: "Mudah" },
  { value: "sedang", label: "Sedang" },
  { value: "sulit",  label: "Sulit" },
];

const OPSI_KEYS = ["A", "B", "C", "D"];

interface Props {
  bankSoal: BankSoalItem;
  soal?: SoalItem;
  defaultBabId?: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function AddSoalModal({ bankSoal, soal, defaultBabId, onClose, onSaved }: Props) {
  const isEdit = !!soal;
  const existingJenis = soal?.jenis_soal?.[0];

  const initOpsi = (): { A: string; B: string; C: string; D: string } => {
    const base = { A: "", B: "", C: "", D: "" };
    if (!existingJenis?.opsi_jawaban) return base;
    existingJenis.opsi_jawaban.forEach(o => {
      if (o.opsi in base) base[o.opsi as keyof typeof base] = o.teks;
    });
    return base;
  };

  const initKunci = (): string[] => {
    if (!existingJenis?.opsi_jawaban) return [];
    return existingJenis.opsi_jawaban.filter(o => o.is_correct).map(o => o.opsi);
  };

  const existingGambar = soal?.media_soal?.find(m => m.tipe === "gambar")?.url ?? null;

  const [jenisSoal, setJenisSoal]     = useState(existingJenis?.jenis_soal ?? "pilihan_ganda");
  const [kesulitan, setKesulitan]     = useState(soal?.tingkat_kesulitan ?? "sedang");
  const [deskripsi, setDeskripsi]     = useState(soal?.deskripsi ?? "");
  const [babId, setBabId]             = useState<number | "">(soal?.bab?.id ?? defaultBabId ?? "");
  const [opsi, setOpsi]               = useState(initOpsi);
  const [kunci, setKunci]             = useState<string[]>(initKunci);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [gambarPreview, setGambarPreview] = useState<string | null>(existingGambar);
  const [gambarFile, setGambarFile]       = useState<File | null>(null);
  const [hapusGambar, setHapusGambar]     = useState(false);
  const [uploading, setUploading]         = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mataKuliahId = bankSoal.mata_kuliah_id;
  const { data: babs } = useSWR(
    mataKuliahId ? `/bab?mata_kuliah_id=${mataKuliahId}` : null,
    () => getBabByMataKuliah(mataKuliahId!),
  );

  const toggleKunci = (huruf: string) => {
    if (jenisSoal === "pilihan_ganda") {
      setKunci([huruf]);
    } else {
      setKunci(prev =>
        prev.includes(huruf) ? prev.filter(k => k !== huruf) : [...prev, huruf]
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGambarFile(file);
    setGambarPreview(URL.createObjectURL(file));
    setHapusGambar(false);
  };

  const handleHapusGambar = () => {
    setGambarFile(null);
    setGambarPreview(null);
    setHapusGambar(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!deskripsi.trim()) { setError("Deskripsi soal wajib diisi."); return; }
    if (jenisSoal !== "essay") {
      if (Object.values(opsi).some(v => !v.trim())) { setError("Semua opsi jawaban wajib diisi."); return; }
      if (kunci.length === 0) { setError("Pilih minimal satu jawaban benar."); return; }
    }

    setSaving(true);
    setError("");
    try {
      let gambarUrl: string | null = null;
      if (gambarFile) {
        setUploading(true);
        gambarUrl = await uploadSoalImage(gambarFile);
        setUploading(false);
      }

      const payload = {
        jenis_soal:        jenisSoal,
        tingkat_kesulitan: kesulitan,
        deskripsi,
        bab_id:            babId || null,
        opsi:              jenisSoal !== "essay" ? opsi : undefined,
        kunci:             jenisSoal !== "essay" ? (jenisSoal === "pilihan_ganda" ? kunci[0] : kunci) : undefined,
        gambar_url:        gambarUrl,
        hapus_gambar:      isEdit ? hapusGambar : undefined,
      };

      if (isEdit && soal) {
        await updateSoal(soal.id, payload);
      } else {
        await createSoal({ bank_soal_id: bankSoal.id, ...payload });
      }
      onSaved();
      onClose();
    } catch {
      setError("Gagal menyimpan soal. Coba lagi.");
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">{isEdit ? "Edit Soal" : "Tambah Soal"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* Jenis Soal */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Jenis Soal</label>
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

          {/* Deskripsi */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Pertanyaan</label>
            <textarea rows={3} value={deskripsi} onChange={e => setDeskripsi(e.target.value)}
              placeholder="Tulis pertanyaan di sini..."
              className={inputClass + " resize-none"} />
          </div>

          {/* Gambar */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Gambar <span className="text-gray-400 font-normal normal-case">(opsional)</span>
            </label>
            {gambarPreview ? (
              <div className="relative inline-block">
                <img src={gambarPreview} alt="preview" className="max-h-40 rounded-lg border border-gray-200 object-contain" />
                <button type="button" onClick={handleHapusGambar}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 cursor-pointer hover:bg-red-600">
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors cursor-pointer w-full">
                <ImagePlus size={16} />
                Upload gambar soal
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Kesulitan + Bab */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Tingkat Kesulitan</label>
              <select value={kesulitan} onChange={e => setKesulitan(e.target.value)} className={inputClass}>
                {KESULITAN_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {babs && babs.length > 0 && (
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                  Bab <span className="text-gray-400 font-normal normal-case">(opsional)</span>
                </label>
                <select value={babId} onChange={e => setBabId(e.target.value ? Number(e.target.value) : "")} className={inputClass}>
                  <option value="">— Pilih Bab —</option>
                  {babs.map(b => (
                    <option key={b.id} value={b.id}>{b.nama_bab}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Opsi Jawaban */}
          {jenisSoal !== "essay" && (
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                Opsi Jawaban
                <span className="text-gray-400 font-normal normal-case ml-1">
                  ({jenisSoal === "pilihan_ganda" ? "klik untuk pilih jawaban benar" : "klik untuk pilih jawaban benar, bisa lebih dari 1"})
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
                        className={inputClass}
                        style={isKunci ? { borderColor: "var(--color-primary)" } : {}} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer">
            Batal
          </button>
          <button type="button" onClick={handleSave} disabled={saving || uploading}
            className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}>
            {uploading
              ? <><Loader2 size={14} className="animate-spin" /> Upload gambar...</>
              : saving
              ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
              : "Simpan Soal"}
          </button>
        </div>
      </div>
    </div>
  );
}
