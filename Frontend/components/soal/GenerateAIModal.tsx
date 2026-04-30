"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import useSWR from "swr";
import { getBankSoal, getBabByMataKuliah, generateSoalAI, saveBulkSoal, type GeneratedSoal, type BabOption } from "@/services/BankSoalServices";
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

interface Props {
  bankSoalId: string;
  onClose: () => void;
  onSaved: () => void;
  hideBabReferensi?: boolean;
}

export default function GenerateAIModal({ bankSoalId, onClose, onSaved, hideBabReferensi = false }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [jenisSoal, setJenisSoal] = useState("pilihan_ganda");
  const [jumlah, setJumlah] = useState(5);
  const [topik, setTopik] = useState("");
  const [kesulitan, setKesulitan] = useState("sedang");
  const [selectedBabIds, setSelectedBabIds] = useState<number[]>([]);
  const [expandedBankSoal, setExpandedBankSoal] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedSoal, setGeneratedSoal] = useState<GeneratedSoal[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [babsMap, setBabsMap] = useState<Record<number, BabOption[]>>({});
  const [loadingBabIds, setLoadingBabIds] = useState<number[]>([]);

  const { data: bankSoalList } = useSWR("/bank-soal/all-with-bab", () =>
    getBankSoal({ per_page: 100 }).then(r => r.data.filter((b: BankSoalItem) => b.mata_kuliah_id))
  );

  const toggleBab = (babId: number) => {
    setSelectedBabIds(prev =>
      prev.includes(babId) ? prev.filter(id => id !== babId) : [...prev, babId]
    );
  };

  const toggleExpand = async (bs: BankSoalItem) => {
    const id = bs.id;
    if (expandedBankSoal.includes(id)) {
      setExpandedBankSoal(prev => prev.filter(x => x !== id));
      return;
    }
    setExpandedBankSoal(prev => [...prev, id]);
    if (!babsMap[id] && bs.mata_kuliah_id) {
      setLoadingBabIds(prev => [...prev, id]);
      try {
        const babs = await getBabByMataKuliah(bs.mata_kuliah_id!);
        setBabsMap(prev => ({ ...prev, [id]: babs }));
      } finally {
        setLoadingBabIds(prev => prev.filter(x => x !== id));
      }
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const hasil = await generateSoalAI({
        jenis_soal: jenisSoal,
        jumlah,
        topik: topik || undefined,
        tingkat_kesulitan: kesulitan,
        referensi_bab_ids: selectedBabIds,
      });
      setGeneratedSoal(hasil);
      setStep(2);
    } catch {
      setError("Gagal generate soal. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveBulkSoal({
        bank_soal_id: bankSoalId,
        jenis_soal: jenisSoal,
        tingkat_kesulitan: kesulitan,
        soal: generatedSoal.map(s => ({
          deskripsi: s.deskripsi,
          opsi: s.opsi,
          kunci: s.kunci,
        })),
      });
      onSaved();
      onClose();
    } catch {
      setError("Gagal menyimpan soal. Coba lagi.");
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
          style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 80%, black)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="text-base font-bold text-white">Generate Soal dengan AI</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {step === 1 ? (
            <>
              {/* Jenis Soal */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Jenis Soal</label>
                <div className="flex gap-2">
                  {JENIS_OPTIONS.map(o => (
                    <button key={o.value} type="button"
                      onClick={() => setJenisSoal(o.value)}
                      className="flex-1 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors"
                      style={jenisSoal === o.value
                        ? { backgroundColor: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }
                        : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah + Kesulitan */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Jumlah Soal</label>
                  <input type="number" min={1} max={20} value={jumlah}
                    onChange={e => setJumlah(Number(e.target.value))}
                    className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Tingkat Kesulitan</label>
                  <select value={kesulitan} onChange={e => setKesulitan(e.target.value)} className={inputClass}>
                    {KESULITAN_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topik */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                  Topik <span className="text-gray-400 font-normal normal-case">(opsional)</span>
                </label>
                <input type="text" value={topik} onChange={e => setTopik(e.target.value)}
                  placeholder="Contoh: Stack dan Queue, Rekursif..."
                  className={inputClass} />
              </div>

              {/* Referensi Bab */}
              {!hideBabReferensi && <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                  Referensi Bab <span className="text-gray-400 font-normal normal-case">(opsional)</span>
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {!bankSoalList ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  ) : bankSoalList.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">Tidak ada bank soal dengan bab.</p>
                  ) : (
                    bankSoalList.map((bs: BankSoalItem) => {
                      const babs = babsMap[bs.id] ?? [];
                      const isExpanded = expandedBankSoal.includes(bs.id);
                      const isLoadingBabs = loadingBabIds.includes(bs.id);
                      return (
                        <div key={bs.id} className="border-b border-gray-50 last:border-0">
                          <button type="button" onClick={() => toggleExpand(bs)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                            <span className="text-xs font-semibold text-gray-700 truncate text-left">{bs.nama}</span>
                          </button>
                          {isExpanded && isLoadingBabs && (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                            </div>
                          )}
                          {isExpanded && !isLoadingBabs && babs.length === 0 && (
                            <p className="text-xs text-gray-400 px-6 py-2">Tidak ada bab.</p>
                          )}
                          {isExpanded && !isLoadingBabs && babs.map(bab => (
                            <label key={bab.id} className="flex items-center gap-2.5 px-6 py-2 hover:bg-gray-50 cursor-pointer">
                              <input type="checkbox"
                                checked={selectedBabIds.includes(bab.id)}
                                onChange={() => toggleBab(bab.id)}
                                className="rounded" />
                              <span className="text-xs text-gray-600">{bab.nama_bab}</span>
                            </label>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
                {selectedBabIds.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{selectedBabIds.length} bab dipilih sebagai referensi</p>
                )}
              </div>}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">{generatedSoal.length} soal berhasil di-generate</p>
                <button type="button" onClick={() => setStep(1)}
                  className="text-xs cursor-pointer"
                  style={{ color: "var(--color-primary)" }}>
                  ← Ubah pengaturan
                </button>
              </div>
              <div className="space-y-3">
                {generatedSoal.map((soal, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-medium text-gray-700">
                        <span className="text-gray-400 mr-1">{String(i + 1).padStart(2, "0")}.</span>
                        {soal.deskripsi}
                      </p>
                      <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                        {soal.bobot} poin
                      </span>
                    </div>
                    {soal.opsi && (
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {Object.entries(soal.opsi).map(([k, v]) => {
                          const isKunci = Array.isArray(soal.kunci) ? soal.kunci.includes(k) : soal.kunci === k;
                          return (
                            <div key={k} className="flex items-center gap-1.5 text-xs rounded-lg px-2 py-1"
                              style={isKunci ? { backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" } : { color: "#6b7280" }}>
                              <span className="font-bold">{k}.</span> {v}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer">
            Batal
          </button>
          {step === 1 ? (
            <button type="button" onClick={handleGenerate} disabled={generating}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 80%, black)" }}>
              {generating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate</>}
            </button>
          ) : (
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: "var(--color-primary)" }}>
              {saving ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : "Simpan ke Bank Soal"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
