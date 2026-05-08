"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, X, BookOpen, Clock, Users, CalendarDays, CheckCircle } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import api from "@/services/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UjianItem {
  id: number;
  nama_ujian: string;
  mata_kuliah: string | null;
  mata_kuliah_id: number | null;
  start_date: string | null;
  end_date: string | null;
  durasi_menit: number;
  jumlah_soal: number;
  jumlah_peserta: number;
  passing_grade: number | null;
  kode_akses: string | null;
  is_kode_aktif: boolean;
  status: "belum_mulai" | "berlangsung" | "selesai";
}

interface MataKuliahOption { id: number; nama: string; kode: string }

interface UjianForm {
  id?: number;
  nama_ujian: string;
  mata_kuliah_id: string;
  start_date: string;
  end_date: string;
  durasi_menit: string;
  passing_grade: string;
  max_attempt: string;
  randomize_soal: boolean;
  kode_akses: string;
  is_kode_aktif: boolean;
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

interface BabOption { id: number; nama_bab: string; urutan: number }
interface BankSoalOption { id: number; nama: string }

const EMPTY_FORM: UjianForm = {
  nama_ujian: "", mata_kuliah_id: "", start_date: "", end_date: "",
  durasi_menit: "90", passing_grade: "60", max_attempt: "1",
  randomize_soal: false, kode_akses: "", is_kode_aktif: false,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fetcher = (url: string) => api.get(url).then(r => r.data);

const STATUS_MAP = {
  belum_mulai: { label: "Belum Mulai", bg: "var(--akademik-tahun-bg)",  color: "var(--akademik-tahun-icon)" },
  berlangsung: { label: "Berlangsung", bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  selesai:     { label: "Selesai",     bg: "var(--color-primary-light)", color: "var(--color-primary)" },
};

function StatusBadge({ status }: { status: UjianItem["status"] }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function fmt(dt: string | null) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    + " " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// ── Soal constants ────────────────────────────────────────────────────────────

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
  ujianId: string; babs: BabOption[]; onSaved: () => void; onClose: () => void;
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
    if (allChecked) setSelected(prev => prev.filter(id => !pageIds.includes(id)));
    else setSelected(prev => [...new Set([...prev, ...pageIds])]);
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
    } finally { setSaving(false); }
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
                <th className="text-left text-xs text-gray-400 font-medium px-3 py-2.5 w-24">Kesulitan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {[0,1,2,3].map(j => (
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
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">←</button>
              <span className="px-2">{page} / {meta.last_page}</span>
              <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">→</button>
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
  ujianId: string; matkulId: number; babs: BabOption[]; onSaved: () => void; onClose: () => void;
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

// ── AcakPanel ─────────────────────────────────────────────────────────────────

function AcakPanel({
  ujianId, matkulId, babs, onSaved, onClose,
}: {
  ujianId: string; matkulId: number; babs: BabOption[]; onSaved: () => void; onClose: () => void;
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
    } finally { setLoading(false); }
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
            <label className={labelCls}>Filter Bab <span className="text-gray-400 normal-case font-normal">(opsional)</span></label>
            <select value={babId} onChange={e => setBabId(e.target.value)} className={inputCls}>
              <option value="">Semua Bab</option>
              {babs.map(b => <option key={b.id} value={b.id}>{b.nama_bab}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Filter Bank Soal <span className="text-gray-400 normal-case font-normal">(opsional)</span></label>
            <select value={bankSoalId} onChange={e => setBankSoalId(e.target.value)} className={inputCls}>
              <option value="">Semua Bank Soal</option>
              {bankSoalOptions.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>
        </div>

        {error   && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
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

// ── TambahSoalModal ── (z-[60] so it renders above UjianModal at z-50) ────────

function TambahSoalModal({
  ujianId, matkulId, onClose, onSaved,
}: {
  ujianId: string; matkulId: number; onClose: () => void; onSaved: () => void;
}) {
  const [tab, setTab] = useState<"pilih" | "buat" | "acak">("pilih");

  const { data: babs = [] } = useSWR(
    ["/bab/matkul-tambah", matkulId],
    () => api.get("/bab", { params: { mata_kuliah_id: matkulId } }).then(r => r.data.data ?? []),
    { revalidateOnFocus: false },
  );

  const tabs = [
    { key: "pilih" as const, label: "Pilih dari Bank Soal" },
    { key: "buat"  as const, label: "Buat Soal Baru" },
    { key: "acak"  as const, label: "Acak dari Bank Soal" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
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

// ── UjianModal ────────────────────────────────────────────────────────────────

function UjianModal({
  mode, initial, matkulList, onClose, onCreated,
}: {
  mode: "create" | "edit";
  initial: UjianForm;
  matkulList: MataKuliahOption[];
  onClose: () => void;    // close + refresh parent list
  onCreated: () => void;  // refresh parent without closing (after create step 1)
}) {
  const [form, setForm]             = useState<UjianForm>(initial);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [createdId, setCreatedId]   = useState<number | null>(null);
  const [tab, setTab]               = useState<"detail" | "soal">("detail");
  const [showTambah, setShowTambah] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isCreateStep2 = mode === "create" && createdId !== null;
  const isOnSoalView  = isCreateStep2 || (mode === "edit" && tab === "soal");
  const soalUjianId   = mode === "edit" ? form.id : createdId;
  const soalMatkulId  = form.mata_kuliah_id ? Number(form.mata_kuliah_id) : null;

  const { data: soalData, mutate: mutateSoal } = useSWR(
    isOnSoalView && soalUjianId ? ["/ujian/soal/modal", soalUjianId] : null,
    () => api.get(`/ujian/dosen/${soalUjianId}/soal`).then(r => r.data),
    { revalidateOnFocus: false },
  );
  const soalList: UjianSoalItem[] = soalData?.data ?? [];

  const set = (k: keyof UjianForm, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const buildPayload = () => ({
    nama_ujian:     form.nama_ujian,
    mata_kuliah_id: Number(form.mata_kuliah_id),
    start_date:     form.start_date,
    end_date:       form.end_date,
    durasi_menit:   Number(form.durasi_menit),
    passing_grade:  form.passing_grade ? Number(form.passing_grade) : undefined,
    max_attempt:    form.max_attempt   ? Number(form.max_attempt)   : 1,
    randomize_soal: form.randomize_soal,
    kode_akses:     form.kode_akses || undefined,
    is_kode_aktif:  form.is_kode_aktif,
  });

  const validate = () => {
    if (!form.nama_ujian || !form.mata_kuliah_id || !form.start_date || !form.end_date || !form.durasi_menit) {
      setError("Nama, mata kuliah, jadwal, dan durasi wajib diisi."); return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSaving(true); setError("");
    try {
      const res = await api.post("/ujian/dosen", buildPayload());
      setCreatedId(res.data.data.id);
      onCreated();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal menyimpan.");
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setSaving(true); setError("");
    try {
      await api.put(`/ujian/dosen/${form.id}`, buildPayload());
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal menyimpan.");
    } finally { setSaving(false); }
  };

  const handleDeleteSoal = async (ujianSoalId: number) => {
    if (!confirm("Hapus soal ini dari ujian?")) return;
    setDeletingId(ujianSoalId);
    try {
      await api.delete(`/ujian/dosen/${soalUjianId}/soal/${ujianSoalId}`);
      mutateSoal();
    } catch { alert("Gagal menghapus soal."); }
    finally { setDeletingId(null); }
  };

  const showDetailForm = !isCreateStep2 && (mode === "create" || tab === "detail");

  const headerTitle = mode === "create"
    ? (isCreateStep2 ? "Tambahkan Soal" : "Buat Ujian")
    : "Edit Ujian";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <div className="flex items-center gap-2">
            {isCreateStep2 && <CheckCircle className="w-4 h-4 text-white/80" />}
            <h3 className="text-base font-bold text-white">{headerTitle}</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit mode: tab bar */}
        {mode === "edit" && (
          <div className="flex px-6 pt-3 pb-0 border-b border-gray-100 shrink-0 gap-1">
            {[
              { key: "detail" as const, label: "Detail" },
              { key: "soal"   as const, label: soalList.length > 0 ? `Soal (${soalList.length})` : "Soal" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer"
                style={tab === t.key
                  ? { backgroundColor: "var(--color-primary)", color: "white" }
                  : { color: "#6b7280" }}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Create step 2: success banner */}
        {isCreateStep2 && (
          <div className="px-6 py-2.5 bg-green-50 border-b border-green-100 shrink-0">
            <p className="text-xs text-green-700">
              Ujian berhasil dibuat! Tambahkan soal atau klik <strong>Selesai</strong>.
            </p>
          </div>
        )}

        {/* Detail form */}
        {showDetailForm && (
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            <div>
              <label className={labelCls}>Nama Ujian</label>
              <input className={inputCls} placeholder="Cth: UTS Kalkulus 2025"
                value={form.nama_ujian} onChange={e => set("nama_ujian", e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Mata Kuliah</label>
              <select className={inputCls} value={form.mata_kuliah_id}
                onChange={e => set("mata_kuliah_id", e.target.value)}>
                <option value="">Pilih Mata Kuliah</option>
                {matkulList.map(m => (
                  <option key={m.id} value={m.id}>{m.kode} — {m.nama}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Mulai</label>
                <input type="datetime-local" className={inputCls}
                  value={form.start_date} onChange={e => set("start_date", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Selesai</label>
                <input type="datetime-local" className={inputCls}
                  value={form.end_date} onChange={e => set("end_date", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Durasi (menit)</label>
                <input type="number" min={1} className={inputCls}
                  value={form.durasi_menit} onChange={e => set("durasi_menit", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Passing Grade</label>
                <input type="number" min={0} max={100} className={inputCls}
                  value={form.passing_grade} onChange={e => set("passing_grade", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Maks Attempt</label>
                <input type="number" min={1} className={inputCls}
                  value={form.max_attempt} onChange={e => set("max_attempt", e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Kode Akses (opsional)</label>
              <input className={inputCls} placeholder="Kosongkan jika tidak pakai kode"
                value={form.kode_akses} onChange={e => set("kode_akses", e.target.value)} />
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" className="accent-[var(--color-primary)] w-4 h-4"
                  checked={form.randomize_soal} onChange={e => set("randomize_soal", e.target.checked)} />
                <span className="text-sm text-gray-700">Acak urutan soal</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" className="accent-[var(--color-primary)] w-4 h-4"
                  checked={form.is_kode_aktif} onChange={e => set("is_kode_aktif", e.target.checked)} />
                <span className="text-sm text-gray-700">Aktifkan kode akses</span>
              </label>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          </div>
        )}

        {/* Soal list view */}
        {isOnSoalView && (
          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-10">#</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Soal</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-24">Jenis</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-24">Kesulitan</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-14">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {soalList.map(item => (
                  <tr key={item.ujian_soal_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400">{String(item.urutan).padStart(2, "0")}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-800 line-clamp-1">{item.deskripsi ?? "-"}</p>
                      {item.bab && <span className="text-xs text-gray-400">{item.bab}</span>}
                    </td>
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
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteSoal(item.ujian_soal_id)}
                        disabled={deletingId === item.ujian_soal_id}
                        className="cursor-pointer transition-colors" title="Hapus dari ujian">
                        {deletingId === item.ujian_soal_id
                          ? <Loader2 size={14} className="animate-spin text-red-400" />
                          : <Trash2 size={14} className="text-red-400 hover:text-red-500" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {soalList.length === 0 && (
              <EmptyState message="Belum ada soal. Klik Tambah Soal untuk mulai." flat />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
          {showDetailForm ? (
            <>
              <button onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
                Batal
              </button>
              <button onClick={mode === "create" ? handleCreate : handleUpdate} disabled={saving}
                className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}>
                {saving
                  ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</>
                  : mode === "create" ? "Buat Ujian →" : "Simpan"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowTambah(true)}
                className="flex items-center gap-1.5 border text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                <Plus size={14} />Tambah Soal
              </button>
              <div className="flex-1" />
              <button onClick={onClose}
                className="text-white text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}>
                Selesai
              </button>
            </>
          )}
        </div>
      </div>

      {showTambah && soalUjianId && soalMatkulId && (
        <TambahSoalModal
          ujianId={String(soalUjianId)}
          matkulId={soalMatkulId}
          onClose={() => setShowTambah(false)}
          onSaved={() => mutateSoal()}
        />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DosenUjianPage() {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [modal, setModal]   = useState<{ mode: "create" | "edit"; form: UjianForm } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search);
  const perPage = usePerPage(64, 1, 430);

  useEffect(() => { setPage(1); }, [debouncedSearch, perPage]);

  const { data, isLoading, mutate } = useSWR(
    ["/ujian/dosen", page, debouncedSearch, perPage],
    () => api.get("/ujian/dosen", { params: { page, per_page: perPage, search: debouncedSearch } }).then(r => r.data),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const { data: matkulData } = useSWR("/mata-kuliah/dosen", fetcher, { revalidateOnFocus: false });
  const matkulList: MataKuliahOption[] = matkulData?.data ?? [];

  const items: UjianItem[] = data?.data ?? [];
  const meta = data?.meta;

  const openCreate = () => setModal({ mode: "create", form: EMPTY_FORM });

  const openEdit = async (item: UjianItem) => {
    const res = await api.get(`/ujian/dosen/${item.id}`);
    const d = res.data.data;
    setModal({
      mode: "edit",
      form: {
        id:             d.id,
        nama_ujian:     d.nama_ujian,
        mata_kuliah_id: String(d.mata_kuliah_id ?? ""),
        durasi_menit:   String(d.durasi_menit ?? ""),
        passing_grade:  String(d.passing_grade ?? ""),
        max_attempt:    String(d.max_attempt ?? "1"),
        start_date:     d.start_date ? d.start_date.slice(0, 16) : "",
        end_date:       d.end_date   ? d.end_date.slice(0, 16)   : "",
        kode_akses:     d.kode_akses ?? "",
        randomize_soal: d.randomize_soal ?? false,
        is_kode_aktif:  d.is_kode_aktif ?? false,
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus ujian ini?")) return;
    setDeleting(id);
    try {
      await api.delete(`/ujian/dosen/${id}`);
      mutate();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Gagal menghapus.");
    } finally { setDeleting(null); }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0"><Breadcrumb /></div>

      <div className="flex-1">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Manajemen Ujian</h2>
              <p className="text-xs text-gray-400 mt-0.5">Buat dan kelola ujian untuk mata kuliah Anda.</p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Cari ujian..." />
              <button onClick={openCreate}
                className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}>
                <Plus size={15} />Buat Ujian
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nama Ujian</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Jadwal</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Durasi</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Soal</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Peserta</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-16">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: perPage }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 animate-pulse">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : items.map((item, idx) => {
                  const no = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{item.nama_ujian}</p>
                        {item.mata_kuliah && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <BookOpen size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{item.mata_kuliah}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarDays size={11} className="text-gray-400 shrink-0" />
                          <span>{fmt(item.start_date)}</span>
                        </div>
                        {item.end_date && (
                          <div className="text-xs text-gray-400 mt-0.5 pl-3.5">s/d {fmt(item.end_date)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={11} className="text-gray-400" />
                          <span>{item.durasi_menit} mnt</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{item.jumlah_soal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users size={11} className="text-gray-400" />
                          <span>{item.jumlah_peserta}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(item)}
                            className="transition-colors cursor-pointer" title="Edit">
                            <Pencil size={15} className="text-gray-400 hover:text-gray-600" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id}
                            className="transition-colors cursor-pointer" title="Hapus">
                            {deleting === item.id
                              ? <Loader2 size={15} className="animate-spin text-red-400" />
                              : <Trash2 size={15} className="text-red-400" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!isLoading && items.length === 0 && (
              <EmptyState message="Belum ada ujian." flat />
            )}
          </div>
        </div>
      </div>

      {meta && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={setPage}
        />
      )}

      {modal && (
        <UjianModal
          mode={modal.mode}
          initial={modal.form}
          matkulList={matkulList}
          onClose={() => { setModal(null); mutate(); }}
          onCreated={() => mutate()}
        />
      )}
    </div>
  );
}
