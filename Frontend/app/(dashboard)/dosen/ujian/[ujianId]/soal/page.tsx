"use client";

import { use, useState, useEffect } from "react";
import useSWR from "swr";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/services/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface UjianInfo {
  id: number;
  nama_ujian: string;
  mata_kuliah_id: number | null;
}

interface UjianSoalItem {
  ujian_soal_id: number;
  soal_id: number;
  urutan: number;
  bobot: number;
  deskripsi: string | null;
  bab: string | null;
  jenis_soal: string | null;
  tingkat_kesulitan: string | null;
  dari_bank_soal: string | null;
}

interface AvailableSoalItem {
  id: number;
  deskripsi: string;
  bab: string | null;
  bab_id: number | null;
  jenis_soal: string | null;
  tingkat_kesulitan: string | null;
  bank_soal: string | null;
}

interface BabOption {
  id: number;
  nama_bab: string;
  urutan: number;
}

interface BankSoalOption {
  id: number;
  nama: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const JENIS_BADGE: Record<string, { label: string; color: string }> = {
  pilihan_ganda: { label: "PG",        color: "var(--color-primary)" },
  essay:         { label: "Essay",     color: "var(--color-warning)" },
  checklist:     { label: "Checklist", color: "var(--akademik-prodi-icon)" },
};

const KESULITAN_BADGE: Record<string, { label: string; color: string }> = {
  mudah:  { label: "Mudah",  color: "#22c55e" },
  sedang: { label: "Sedang", color: "var(--color-warning)" },
  sulit:  { label: "Sulit",  color: "#ef4444" },
};

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

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]";
const labelCls = "text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide";

// ── PilihPanel ────────────────────────────────────────────────────────────────

function PilihPanel({
  ujianId, babs, onSaved, onClose,
}: {
  ujianId: string;
  babs: BabOption[];
  onSaved: () => void;
  onClose: () => void;
}) {
  const [babId, setBabId]       = useState("");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage]         = useState(1);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const debouncedSearch         = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, babId]);

  const { data, isLoading } = useSWR(
    ["/available-soal", ujianId, babId, debouncedSearch, page],
    () => api.get(`/ujian/dosen/${ujianId}/available-soal`, {
      params: { bab_id: babId || undefined, search: debouncedSearch || undefined, page, per_page: 20 },
    }).then(r => r.data),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  const soalList: AvailableSoalItem[] = data?.data ?? [];
  const meta = data?.meta;

  const pageIds    = soalList.map(s => s.id);
  const allChecked = pageIds.length > 0 && pageIds.every(id => selected.includes(id));

  const toggle = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () => {
    if (allChecked) {
      setSelected(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelected(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleAdd = async () => {
    if (selected.length === 0) { setError("Pilih minimal 1 soal."); return; }
    setSaving(true); setError("");
    try {
      await api.post(`/ujian/dosen/${ujianId}/soal`, { soal_ids: selected });
      onSaved(); onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal menambahkan soal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="overflow-y-auto flex-1 p-5">
        <div className="flex gap-2 mb-4">
          <select value={babId} onChange={e => setBabId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] flex-1">
            <option value="">Semua Bab</option>
            {babs.map(b => <option key={b.id} value={b.id}>{b.nama_bab}</option>)}
          </select>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari soal..." />
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-2.5 w-8">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll}
                    className="accent-[var(--color-primary)] cursor-pointer" />
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-3 py-2.5">Soal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-3 py-2.5 w-20">Jenis</th>
                <th className="text-left text-xs text-gray-400 font-medium px-3 py-2.5 w-20">Kesulitan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {[0, 1, 2, 3].map(j => (
                      <td key={j} className="px-3 py-3"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : soalList.map(s => (
                <tr key={s.id} onClick={() => toggle(s.id)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)}
                      className="accent-[var(--color-primary)] cursor-pointer" />
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-800 text-xs line-clamp-2">{s.deskripsi}</p>
                    {s.bab && <span className="text-xs text-gray-400">{s.bab}</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium"
                      style={{ color: JENIS_BADGE[s.jenis_soal ?? ""]?.color ?? "#6b7280" }}>
                      {JENIS_BADGE[s.jenis_soal ?? ""]?.label ?? s.jenis_soal ?? "-"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium"
                      style={{ color: KESULITAN_BADGE[s.tingkat_kesulitan ?? ""]?.color ?? "#6b7280" }}>
                      {KESULITAN_BADGE[s.tingkat_kesulitan ?? ""]?.label ?? s.tingkat_kesulitan ?? "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && soalList.length === 0 && (
            <EmptyState message="Tidak ada soal tersedia." flat />
          )}
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>{meta.total} soal tersedia</span>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">
                ←
              </button>
              <span className="px-2">{page} / {meta.last_page}</span>
              <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">
                →
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center gap-3">
        <span className="text-xs text-gray-500 flex-1">{selected.length} soal dipilih</span>
        <button onClick={onClose}
          className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
          Batal
        </button>
        <button onClick={handleAdd} disabled={saving || selected.length === 0}
          className="text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {saving
            ? <><Loader2 size={14} className="animate-spin" />Menambahkan...</>
            : `Tambah ${selected.length > 0 ? `${selected.length} ` : ""}Soal`}
        </button>
      </div>
    </>
  );
}

// ── BuatPanel ─────────────────────────────────────────────────────────────────

function BuatPanel({
  ujianId, matkulId, babs, onSaved, onClose,
}: {
  ujianId: string;
  matkulId: number;
  babs: BabOption[];
  onSaved: () => void;
  onClose: () => void;
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
    simpanKeBankSoal ? ["/bank-soal/matkul", matkulId] : null,
    () => api.get("/bank-soal", { params: { mata_kuliah_id: matkulId, per_page: 100 } }).then(r => r.data.data ?? []),
    { revalidateOnFocus: false },
  );
  const bankSoalOptions: BankSoalOption[] = bankSoalData ?? [];

  const toggleKunci = (huruf: string) => {
    if (jenisSoal === "pilihan_ganda") {
      setKunci([huruf]);
    } else {
      setKunci(prev => prev.includes(huruf) ? prev.filter(k => k !== huruf) : [...prev, huruf]);
    }
  };

  const handleSave = async () => {
    if (!deskripsi.trim()) { setError("Deskripsi wajib diisi."); return; }
    if (jenisSoal !== "essay") {
      if (Object.values(opsi).some(v => !v.trim())) { setError("Semua opsi jawaban wajib diisi."); return; }
      if (kunci.length === 0) { setError("Pilih minimal satu jawaban benar."); return; }
    }
    if (simpanKeBankSoal && !bankSoalId) { setError("Pilih bank soal tujuan."); return; }

    setSaving(true); setError("");
    try {
      await api.post(`/ujian/dosen/${ujianId}/soal/buat-baru`, {
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
      });
      onSaved(); onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal menyimpan soal.");
    } finally {
      setSaving(false);
    }
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

// ── AcakPanel ─────────────────────────────────────────────────────────────────

function AcakPanel({
  ujianId, matkulId, babs, onSaved, onClose,
}: {
  ujianId: string;
  matkulId: number;
  babs: BabOption[];
  onSaved: () => void;
  onClose: () => void;
}) {
  const [babId, setBabId]           = useState("");
  const [bankSoalId, setBankSoalId] = useState("");
  const [jumlah, setJumlah]         = useState("10");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  const { data: bankSoalData } = useSWR(
    ["/bank-soal/acak", matkulId],
    () => api.get("/bank-soal", { params: { mata_kuliah_id: matkulId, per_page: 100 } }).then(r => r.data.data ?? []),
    { revalidateOnFocus: false },
  );
  const bankSoalOptions: BankSoalOption[] = bankSoalData ?? [];

  const handleAcak = async () => {
    const n = Number(jumlah);
    if (!n || n < 1) { setError("Jumlah minimal 1 soal."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await api.post(`/ujian/dosen/${ujianId}/soal/random`, {
        bab_id:       babId ? Number(babId) : undefined,
        bank_soal_id: bankSoalId ? Number(bankSoalId) : undefined,
        jumlah:       n,
      });
      setSuccess(res.data.message ?? "Soal berhasil ditambahkan!");
      onSaved();
      setTimeout(() => onClose(), 1500);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal mengambil soal acak.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-y-auto flex-1 p-5 space-y-4">
        <p className="text-sm text-gray-500">
          Sistem akan mengambil soal secara acak dari bank soal yang kamu miliki atau yang dibagikan kepadamu, sesuai mata kuliah ujian ini.
        </p>

        <div>
          <label className={labelCls}>Jumlah Soal yang Diambil</label>
          <input type="number" min={1} max={200} value={jumlah} onChange={e => setJumlah(e.target.value)}
            className={inputCls} placeholder="Contoh: 20" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>
              Filter Bab <span className="text-gray-400 normal-case font-normal">(opsional)</span>
            </label>
            <select value={babId} onChange={e => setBabId(e.target.value)} className={inputCls}>
              <option value="">Semua Bab</option>
              {babs.map(b => <option key={b.id} value={b.id}>{b.nama_bab}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>
              Filter Bank Soal <span className="text-gray-400 normal-case font-normal">(opsional)</span>
            </label>
            <select value={bankSoalId} onChange={e => setBankSoalId(e.target.value)} className={inputCls}>
              <option value="">Semua Bank Soal</option>
              {bankSoalOptions.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">{success}</p>}
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
        <button onClick={onClose}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
          Batal
        </button>
        <button onClick={handleAcak} disabled={loading}
          className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {loading
            ? <><Loader2 size={14} className="animate-spin" />Mengambil...</>
            : `Ambil ${jumlah || ""} Soal Acak`}
        </button>
      </div>
    </>
  );
}

// ── TambahSoalModal ───────────────────────────────────────────────────────────

function TambahSoalModal({
  ujianId, matkulId, onClose, onSaved,
}: {
  ujianId: string;
  matkulId: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [tab, setTab] = useState<"pilih" | "buat" | "acak">("pilih");

  const { data: babs = [] } = useSWR(
    ["/bab/matkul", matkulId],
    () => api.get("/bab", { params: { mata_kuliah_id: matkulId } }).then(r => r.data.data ?? []),
    { revalidateOnFocus: false },
  );

  const tabs: { key: typeof tab; label: string }[] = [
    { key: "pilih", label: "Pilih dari Bank Soal" },
    { key: "buat",  label: "Buat Soal Baru" },
    { key: "acak",  label: "Acak dari Bank Soal" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">Tambah Soal ke Ujian</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex px-6 pt-3 pb-0 border-b border-gray-100 shrink-0 gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer"
              style={tab === t.key
                ? { backgroundColor: "var(--color-primary)", color: "white" }
                : { color: "#6b7280" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "pilih" && <PilihPanel ujianId={ujianId} babs={babs} onSaved={onSaved} onClose={onClose} />}
        {tab === "buat"  && <BuatPanel  ujianId={ujianId} matkulId={matkulId} babs={babs} onSaved={onSaved} onClose={onClose} />}
        {tab === "acak"  && <AcakPanel  ujianId={ujianId} matkulId={matkulId} babs={babs} onSaved={onSaved} onClose={onClose} />}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DosenUjianSoalPage({ params }: { params: Promise<{ ujianId: string }> }) {
  const { ujianId } = use(params);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);

  const { data, isLoading, mutate } = useSWR(
    ["/ujian/dosen/soal", ujianId],
    () => api.get(`/ujian/dosen/${ujianId}/soal`).then(r => r.data),
    { revalidateOnFocus: false },
  );

  const soalList: UjianSoalItem[]   = data?.data ?? [];
  const ujian: UjianInfo | undefined = data?.ujian;

  const handleDelete = async (ujianSoalId: number) => {
    if (!confirm("Hapus soal ini dari ujian?")) return;
    setDeleting(ujianSoalId);
    try {
      await api.delete(`/ujian/dosen/${ujianId}/soal/${ujianSoalId}`);
      mutate();
    } catch {
      alert("Gagal menghapus soal.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb
          overrides={{ soal: "Kelola Soal" }}
          hrefOverrides={ujian ? { [`/dosen/ujian/${ujianId}`]: ujian.nama_ujian } : undefined}
        />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Kelola Soal Ujian
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {ujian ? `${ujian.nama_ujian} · ` : ""}{soalList.length} soal
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: "var(--color-primary)" }}>
            <Plus size={15} />Tambah Soal
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-10">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Soal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-28">Bab</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-24">Jenis</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-24">Kesulitan</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-16">Bobot</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-16">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : soalList.map(item => (
                <tr key={item.ujian_soal_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">{String(item.urutan).padStart(2, "0")}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-800 line-clamp-2">{item.deskripsi ?? "-"}</p>
                    {item.dari_bank_soal && (
                      <span className="text-xs text-gray-400">{item.dari_bank_soal}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.bab ?? "-"}</td>
                  <td className="px-4 py-3">
                    {item.jenis_soal ? (
                      <span className="text-xs font-medium"
                        style={{ color: JENIS_BADGE[item.jenis_soal]?.color ?? "#6b7280" }}>
                        {JENIS_BADGE[item.jenis_soal]?.label ?? item.jenis_soal}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {item.tingkat_kesulitan ? (
                      <span className="text-xs font-medium"
                        style={{ color: KESULITAN_BADGE[item.tingkat_kesulitan]?.color ?? "#6b7280" }}>
                        {KESULITAN_BADGE[item.tingkat_kesulitan]?.label ?? item.tingkat_kesulitan}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.bobot}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(item.ujian_soal_id)}
                      disabled={deleting === item.ujian_soal_id}
                      className="cursor-pointer transition-colors" title="Hapus dari ujian">
                      {deleting === item.ujian_soal_id
                        ? <Loader2 size={15} className="animate-spin text-red-400" />
                        : <Trash2 size={15} className="text-red-400 hover:text-red-500" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && soalList.length === 0 && (
            <EmptyState message="Belum ada soal di ujian ini. Klik Tambah Soal untuk mulai." flat />
          )}
        </div>
      </div>

      {showModal && ujian?.mata_kuliah_id && (
        <TambahSoalModal
          ujianId={ujianId}
          matkulId={ujian.mata_kuliah_id}
          onClose={() => setShowModal(false)}
          onSaved={() => mutate()}
        />
      )}
    </div>
  );
}
