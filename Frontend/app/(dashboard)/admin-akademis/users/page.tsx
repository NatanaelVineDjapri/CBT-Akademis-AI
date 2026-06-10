"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Plus, Pencil, Trash2, Upload, X, Loader2, FileSpreadsheet, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import {
  getAdminAkademisUsers,
  createAdminAkademisUser,
  updateAdminAkademisUser,
  deleteAdminAkademisUser,
  importAdminAkademisUsers,
  getProdi,
  type AdminUserItem,
} from "@/services/AdminUserServices";
import { getUniversitas } from "@/services/UniversitasService";
import { ROLE_OPTIONS, ROLE_BADGE } from "@/types";

const TABS = [
  { key: "",                       label: "Semua" },
  { key: "admin_universitas",      label: "Admin Univ" },
  { key: "dosen",                  label: "Dosen" },
  { key: "mahasiswa",              label: "Mahasiswa" },
  { key: "peserta_mahasiswa_baru", label: "Peserta PMB" },
];

type UserSortBy = "nama" | "email" | "role";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort }: {
  label: string; col: UserSortBy;
  sortBy: UserSortBy; sortDir: SortDir;
  onSort: (col: UserSortBy) => void;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 cursor-pointer select-none whitespace-nowrap"
      onClick={() => onSort(col)}>
      <span className="flex items-center gap-1">{label}<Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} /></span>
    </th>
  );
}

function RoleBadge({ role }: { role: string }) {
  const b = ROLE_BADGE[role] ?? { label: role, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: b.bg, color: b.color }}>
      {b.label}
    </span>
  );
}

// ─── User Form Modal ───────────────────────────────────────────────────────────
interface UserFormModalProps {
  mode: "create" | "edit";
  item?: AdminUserItem;
  onClose: () => void;
  onSaved: () => void;
}

function UserFormModal({ mode, item, onClose, onSaved }: UserFormModalProps) {
  const [nama, setNama] = useState(item?.nama ?? "");
  const [email, setEmail] = useState(item?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(item?.role ?? "mahasiswa");
  const [nim, setNim] = useState(item?.nim ?? "");
  const [nidn, setNidn] = useState(item?.nidn ?? "");
  const [noTelp, setNoTelp] = useState(item?.no_telp ?? "");
  const [alamat, setAlamat] = useState(item?.alamat ?? "");
  const [tahunMasuk, setTahunMasuk] = useState(item?.tahun_masuk ? String(item.tahun_masuk) : "");
  const [universitasId, setUniversitasId] = useState<string>(item?.universitas_id ? String(item.universitas_id) : "");
  const [prodiId, setProdiId] = useState<string>(item?.prodi_id ? String(item.prodi_id) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { data: univData } = useSWR("/universitas/all", () => getUniversitas({ per_page: 200 }), { revalidateOnFocus: false });
  const univList = univData?.data ?? [];

  const { data: prodiData } = useSWR(
    universitasId ? ["/prodi/by-univ", universitasId] : null,
    () => getProdi({ universitas_id: Number(universitasId), per_page: 200 }),
    { revalidateOnFocus: false }
  );
  const prodiList = prodiData?.data ?? [];

  const handleUniversitasChange = (val: string) => {
    setUniversitasId(val);
    setProdiId("");
  };

  const handleSubmit = async () => {
    if (!nama.trim() || !email.trim()) { setError("Nama dan email wajib diisi."); return; }
    if (mode === "create" && password.length < 8) { setError("Password minimal 8 karakter."); return; }
    if (mode === "create" && !universitasId) { setError("Universitas wajib dipilih."); return; }

    setSaving(true);
    setError("");
    try {
      const payload = {
        nama: nama.trim(),
        email: email.trim(),
        role,
        nim: nim.trim() || undefined,
        nidn: nidn.trim() || undefined,
        no_telp: noTelp.trim() || undefined,
        alamat: alamat.trim() || undefined,
        tahun_masuk: tahunMasuk ? Number(tahunMasuk) : undefined,
        prodi_id: prodiId ? Number(prodiId) : undefined,
        universitas_id: universitasId ? Number(universitasId) : undefined,
      };
      if (mode === "create") {
        await createAdminAkademisUser({ ...payload, password, universitas_id: Number(universitasId) });
      } else {
        await updateAdminAkademisUser(item!.id, payload);
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block";

  const showNim  = role === "mahasiswa" || role === "peserta_mahasiswa_baru";
  const showNidn = role === "dosen";
  const showTahunMasuk = role === "mahasiswa";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">
            {mode === "create" ? "Tambah User" : "Edit User"}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className={labelClass}>Universitas <span className="text-red-400 normal-case font-normal">*</span></label>
            <select value={universitasId} onChange={e => handleUniversitasChange(e.target.value)} className={inputClass}>
              <option value="">Pilih universitas...</option>
              {univList.map(u => <option key={u.id} value={String(u.id)}>{u.nama}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nama <span className="text-red-400 normal-case font-normal">*</span></label>
            <input type="text" value={nama} onChange={e => setNama(e.target.value)} className={inputClass} placeholder="Nama lengkap" />
          </div>
          <div>
            <label className={labelClass}>Email <span className="text-red-400 normal-case font-normal">*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="email@example.com" />
          </div>
          {mode === "create" && (
            <div>
              <label className={labelClass}>Password <span className="text-red-400 normal-case font-normal">*</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="Min. 8 karakter" />
            </div>
          )}
          <div>
            <label className={labelClass}>Role <span className="text-red-400 normal-case font-normal">*</span></label>
            <select value={role} onChange={e => setRole(e.target.value)} className={inputClass}>
              {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {showNim && (
            <div>
              <label className={labelClass}>NIM</label>
              <input type="text" value={nim} onChange={e => setNim(e.target.value)} className={inputClass} placeholder="Nomor Induk Mahasiswa" />
            </div>
          )}
          {showNidn && (
            <div>
              <label className={labelClass}>NIDN</label>
              <input type="text" value={nidn} onChange={e => setNidn(e.target.value)} className={inputClass} placeholder="Nomor Induk Dosen Nasional" />
            </div>
          )}
          {showTahunMasuk && (
            <div>
              <label className={labelClass}>Tahun Masuk</label>
              <input type="number" value={tahunMasuk} onChange={e => setTahunMasuk(e.target.value)} className={inputClass} placeholder="2024" />
            </div>
          )}
          <div>
            <label className={labelClass}>Program Studi</label>
            <select value={prodiId} onChange={e => setProdiId(e.target.value)} className={inputClass} disabled={!universitasId}>
              <option value="">{universitasId ? "Pilih prodi (opsional)..." : "Pilih universitas dulu"}</option>
              {prodiList.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>No. Telepon</label>
            <input type="text" value={noTelp} onChange={e => setNoTelp(e.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />
          </div>
          <div>
            <label className={labelClass}>Alamat</label>
            <textarea value={alamat} onChange={e => setAlamat(e.target.value)} className={inputClass} placeholder="Alamat lengkap" rows={2} />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}>
            {saving ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Import Modal ──────────────────────────────────────────────────────────────
function ImportModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const excelRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [universitasId, setUniversitasId] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ gagal: { baris: number; kolom: string; error: string }[] } | null>(null);
  const [error, setError] = useState("");

  const { data: univData } = useSWR("/universitas/all-import", () => getUniversitas({ per_page: 200 }), { revalidateOnFocus: false });
  const univList = univData?.data ?? [];

  const handleImport = async () => {
    if (!excelFile) { setError("File Excel wajib dipilih."); return; }
    if (!universitasId) { setError("Universitas wajib dipilih."); return; }
    setImporting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file_excel", excelFile);
      fd.append("universitas_id", universitasId);
      if (zipFile) fd.append("file_zip", zipFile);
      const res = await importAdminAkademisUsers(fd);
      setResult(res);
      onSaved();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal import. Coba lagi.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">Import User</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Universitas <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <select value={universitasId} onChange={e => setUniversitasId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]">
              <option value="">Pilih universitas...</option>
              {univList.map(u => <option key={u.id} value={String(u.id)}>{u.nama}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              File Excel <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <div onClick={() => excelRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors">
              <FileSpreadsheet className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">{excelFile ? excelFile.name : "Klik untuk pilih file .xlsx / .xls"}</p>
            </div>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden"
              onChange={e => setExcelFile(e.target.files?.[0] ?? null)} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              File ZIP Foto <span className="text-gray-400 font-normal normal-case">(opsional)</span>
            </label>
            <div onClick={() => zipRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">{zipFile ? zipFile.name : "Klik untuk pilih file .zip berisi foto"}</p>
            </div>
            <input ref={zipRef} type="file" accept=".zip" className="hidden"
              onChange={e => setZipFile(e.target.files?.[0] ?? null)} />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          {result && (
            <div className="border border-gray-100 rounded-xl p-4">
              {result.gagal.length === 0 ? (
                <p className="text-xs text-green-600 font-medium">Semua data berhasil diimport!</p>
              ) : (
                <>
                  <p className="text-xs font-semibold text-red-500 mb-2">{result.gagal.length} baris gagal:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.gagal.map((f, i) => (
                      <p key={i} className="text-xs text-gray-500">Baris {f.baris} ({f.kolom}): {f.error}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer">
            {result ? "Tutup" : "Batal"}
          </button>
          {!result && (
            <button onClick={handleImport} disabled={importing || !excelFile || !universitasId}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: "var(--color-primary)" }}>
              {importing ? <><Loader2 size={14} className="animate-spin" /> Mengimport...</> : "Import"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminAkademisUsersPage() {
  const perPage = usePerPage(44, 1, 500);
  const [search, setSearch] = useState("");
  const [roleTab, setRoleTab] = useState("");
  const [universitasFilter, setUniversitasFilter] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const [sortBy, setSortBy] = useState<UserSortBy>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<AdminUserItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AdminUserItem | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSort = (col: UserSortBy) => {
    if (col === sortBy) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  useEffect(() => { setPage(1); }, [debouncedSearch, roleTab, universitasFilter, perPage]);

  const { data: univData } = useSWR("/universitas/all-filter", () => getUniversitas({ per_page: 200 }), { revalidateOnFocus: false });
  const univList = univData?.data ?? [];

  const { data, isLoading, mutate } = useSWR(
    ["/admin-users", universitasFilter, roleTab, debouncedSearch, page, perPage, sortBy, sortDir],
    ([, uid, role, s, p, pp, sb, sd]: [string, string, string, string, number, number, string, string]) =>
      getAdminAkademisUsers({
        universitas_id: uid ? Number(uid) : undefined,
        role: role || undefined,
        search: s,
        per_page: pp,
        page: p,
        sort_by: sb,
        sort_dir: sd,
      }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const items = data?.data ?? [];
  const meta  = data?.meta ?? null;

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await deleteAdminAkademisUser(deleteItem.id);
      mutate();
      setDeleteItem(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
                Manajemen User
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Semua pengguna di seluruh universitas.</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2">
              <select
                value={universitasFilter}
                onChange={e => setUniversitasFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-auto"
              >
                <option value="">Semua Universitas</option>
                {univList.map(u => <option key={u.id} value={String(u.id)}>{u.nama}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Cari user..." />
                <button
                  onClick={() => setShowImport(true)}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border cursor-pointer whitespace-nowrap shrink-0"
                  style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
                >
                  <Upload size={15} />
                  <span className="hidden sm:inline">Import</span>
                </button>
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Plus size={15} />
                  <span className="hidden sm:inline">Tambah User</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-1 px-5 pt-3 pb-0 border-b border-gray-100 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setRoleTab(tab.key)}
                className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                style={roleTab === tab.key
                  ? { backgroundColor: "var(--color-primary)", color: "white" }
                  : { color: "#6b7280" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-44" />
                <col className="w-52" />
                <col className="w-28" />
                <col className="w-36" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-20" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">#</th>
                  <ColHeader label="Nama" col="nama" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <ColHeader label="Email" col="email" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <ColHeader label="Role" col="role" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Universitas</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">NIM / NIDN</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">No. Telp</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 animate-pulse">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : items.map((item, idx) => {
                  const no = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 10) + idx + 1;
                  const nimNidn = item.nim || item.nidn || "-";
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 truncate">{item.nama}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs truncate">{item.email}</td>
                      <td className="px-4 py-3"><RoleBadge role={item.role} /></td>
                      <td className="px-4 py-3 text-gray-500 text-xs truncate">{item.universitas?.kode ?? "-"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{nimNidn}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{item.no_telp || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditItem(item)} className="text-green-500 hover:text-green-600 transition-colors cursor-pointer">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteItem(item)} className="text-red-400 hover:text-red-500 transition-colors cursor-pointer">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {data && items.length === 0 && (
              <EmptyState message="Tidak ada user ditemukan." flat />
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

      {(showCreate || editItem) && (
        <UserFormModal
          mode={editItem ? "edit" : "create"}
          item={editItem ?? undefined}
          onClose={() => { setShowCreate(false); setEditItem(null); }}
          onSaved={() => mutate()}
        />
      )}

      {deleteItem && (
        <ConfirmModal
          message={`Hapus user "${deleteItem.nama}"?`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onSaved={() => mutate()}
        />
      )}
    </div>
  );
}
