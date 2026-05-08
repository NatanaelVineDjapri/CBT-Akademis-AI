"use client";

import useSWR, { preload } from "swr";
import Link from "next/link";
import { GraduationCap, Users, BookOpen, Download, X, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import EmptyState from "@/components/EmptyState";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { getFakultas, getProdi, exportAdminUsers, type FakultasItem, type ProdiItem } from "@/services/AdminUserServices";

const COLUMN_OPTIONS = [
  { key: "nama",        label: "Nama" },
  { key: "email",       label: "Email" },
  { key: "role",        label: "Role" },
  { key: "nim",         label: "NIM" },
  { key: "nidn",        label: "NIDN" },
  { key: "prodi",       label: "Program Studi" },
  { key: "tahun_masuk", label: "Angkatan" },
  { key: "no_telp",     label: "No. Telepon" },
  { key: "alamat",      label: "Alamat" },
];

const ROLE_OPTIONS = [
  { value: "",                          label: "Semua Role" },
  { value: "mahasiswa",                 label: "Mahasiswa" },
  { value: "dosen",                     label: "Dosen" },
  { value: "peserta_mahasiswa_baru",    label: "Peserta PMB" },
  { value: "admin_universitas",         label: "Admin Universitas" },
];

function ExportModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState("");
  const [tahunDari, setTahunDari] = useState("");
  const [tahunSampai, setTahunSampai] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [columns, setColumns] = useState<string[]>(["nama", "email", "role", "nim", "nidn", "prodi", "tahun_masuk"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: prodiData } = useSWR("/prodi/all", () => getProdi({ per_page: 500 }), { revalidateOnFocus: false });
  const prodiList: ProdiItem[] = prodiData?.data ?? [];

  const toggleColumn = (key: string) => {
    setColumns(prev => prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]);
  };

  const handleExport = async () => {
    if (columns.length === 0) { setError("Pilih minimal 1 kolom."); return; }
    setLoading(true);
    setError("");
    try {
      const blob = await exportAdminUsers({
        role: role || undefined,
        tahun_dari: tahunDari || undefined,
        tahun_sampai: tahunSampai || undefined,
        prodi_id: prodiId ? Number(prodiId) : undefined,
        columns,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data-user-${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch {
      setError("Gagal export. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">Export Data User</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className={labelClass}>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className={inputClass}>
              {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Angkatan (Tahun Masuk)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={tahunDari} onChange={e => setTahunDari(e.target.value)}
                className={inputClass} placeholder="Dari (2021)" min={2000} max={2099} />
              <input type="number" value={tahunSampai} onChange={e => setTahunSampai(e.target.value)}
                className={inputClass} placeholder="Sampai (2024)" min={2000} max={2099} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Program Studi</label>
            <select value={prodiId} onChange={e => setProdiId(e.target.value)} className={inputClass}>
              <option value="">Semua Prodi</option>
              {prodiList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Kolom yang Di-export</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {COLUMN_OPTIONS.map(col => (
                <label key={col.key} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={columns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="accent-[var(--color-primary)] w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
            Batal
          </button>
          <button onClick={handleExport} disabled={loading}
            className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}>
            {loading
              ? <><Loader2 size={14} className="animate-spin" />Mengekspor...</>
              : <><Download size={14} />Export Excel</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function FakultasCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 bg-gray-50 rounded-xl h-14" />
        ))}
      </div>
    </div>
  );
}

function FakultasCard({ item, href }: { item: FakultasItem; href: string }) {
  return (
    <Link
      href={href}
      onMouseEnter={() => {
        preload(["/prodi", String(item.id)], () => getProdi({ fakultas_id: item.id, per_page: 100 }));
        preload(["/fakultas/single", String(item.id)], () => getFakultas({ per_page: 100 }).then(r => r.data.find(f => f.id === item.id)));
      }}
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[var(--color-primary)] hover:shadow-md transition-all block">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {item.kode}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate group-hover:text-[var(--color-primary)] transition-colors">
            {item.nama}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.prodi_count}</p>
          <p className="text-xs text-gray-400">Prodi</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.total_dosen}</p>
          <p className="text-xs text-gray-400">Dosen</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.total_mahasiswa}</p>
          <p className="text-xs text-gray-400">Mahasiswa</p>
        </div>
      </div>
    </Link>
  );
}

export default function AdminUserFakultasPage() {
  const { user } = useUser();
  const [showExport, setShowExport] = useState(false);

  const { data } = useSWR(
    user?.universitas_id ? ["/fakultas", user.universitas_id] : null,
    ([, univId]) => getFakultas({ universitas_id: univId, per_page: 100 }),
    { revalidateOnFocus: false }
  );

  const items = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold mb-1" style={{ color: "var(--color-primary)" }}>
            Manajemen User
          </h2>
          <p className="text-xs text-gray-400">Pilih fakultas untuk melihat program studi dan daftar user.</p>
        </div>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border cursor-pointer whitespace-nowrap"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
        >
          <Download size={15} />
          Export
        </button>
      </div>

      {!data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <FakultasCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <EmptyState message="Belum ada fakultas." flat />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <FakultasCard
              key={item.id}
              item={item}
              href={`/admin-universitas/user/fakultas/${item.id}`}
            />
          ))}
        </div>
      )}

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}
