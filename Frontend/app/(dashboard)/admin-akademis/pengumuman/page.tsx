"use client";

import useSWR from "swr";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getPengumuman, createPengumuman, updatePengumuman, deletePengumuman, type Pengumuman } from "@/services/PengumumanService";
import BreadCrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";

const roleOptions = [
  { value: "", label: "Semua Pengguna" },
  { value: "mahasiswa", label: "Mahasiswa" },
  { value: "dosen", label: "Dosen" },
  { value: "peserta_mahasiswa_baru", label: "Peserta PMB" },
];

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Semua</span>;
  const map: Record<string, string> = { mahasiswa: "Mahasiswa", dosen: "Dosen", peserta_mahasiswa_baru: "Peserta PMB" };
  const colors: Record<string, string> = { mahasiswa: "bg-blue-50 text-blue-600", dosen: "bg-purple-50 text-purple-600", peserta_mahasiswa_baru: "bg-amber-50 text-amber-600" };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${colors[role] ?? "bg-gray-100 text-gray-500"}`}>{map[role] ?? role}</span>;
}

type PengumumanSortBy = "judul" | "created_at" | "expired_at";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort, className }: {
  label: string; col: PengumumanSortBy;
  sortBy: PengumumanSortBy; sortDir: SortDir;
  onSort: (col: PengumumanSortBy) => void;
  className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`text-left text-xs text-gray-400 font-medium px-4 py-3 cursor-pointer select-none whitespace-nowrap ${className ?? ""}`}
      onClick={() => onSort(col)}>
      <span className="flex items-center gap-1">{label}<Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} /></span>
    </th>
  );
}

type FormState = { judul: string; isi: string; target_role: string; expired_at: string };
const emptyForm: FormState = { judul: "", isi: "", target_role: "", expired_at: "" };

export default function PengumumanPage() {
  const { data, isLoading, mutate } = useSWR("/pengumuman", getPengumuman, { revalidateOnFocus: false });
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editItem, setEditItem]       = useState<Pengumuman | null>(null);
  const [form, setForm]               = useState<FormState>(emptyForm);
  const [sortBy, setSortBy]           = useState<PengumumanSortBy>("created_at");
  const [sortDir, setSortDir]         = useState<SortDir>("desc");
  const [saving, setSaving]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Pengumuman | null>(null);
  const [deleting, setDeleting]       = useState(false);

  const handleSort = (col: PengumumanSortBy) => {
    if (col === sortBy) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir(col === "judul" ? "asc" : "desc");
    }
  };

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: Pengumuman) => {
    setEditItem(item);
    setForm({
      judul:       item.judul,
      isi:         item.isi,
      target_role: item.target_role ?? "",
      expired_at:  item.expired_at ? item.expired_at.slice(0, 16) : "",
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSubmit = async () => {
    if (!form.judul.trim() || !form.isi.trim()) return;
    setSaving(true);
    try {
      if (editItem) {
        await updatePengumuman(editItem.id, { judul: form.judul, isi: form.isi, target_role: form.target_role || undefined, expired_at: form.expired_at || undefined });
      } else {
        await createPengumuman({ judul: form.judul, isi: form.isi, target_role: form.target_role || undefined, expired_at: form.expired_at || undefined });
      }
      await mutate();
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deletePengumuman(confirmDelete.id);
      setConfirmDelete(null);
      mutate();
    } finally {
      setDeleting(false);
    }
  };

  const filtered = (data ?? [])
    .filter(item => {
      const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase()) || item.isi.toLowerCase().includes(search.toLowerCase());
      const matchRole   = !roleFilter || item.target_role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      let valA: string, valB: string;
      if (sortBy === "judul") {
        valA = a.judul.toLowerCase();
        valB = b.judul.toLowerCase();
      } else if (sortBy === "expired_at") {
        valA = a.expired_at ?? "";
        valB = b.expired_at ?? "";
      } else {
        valA = a.created_at;
        valB = b.created_at;
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0"><BreadCrumb /></div>

      <div className="flex-1">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Pengumuman</h2>
            <p className="text-xs text-gray-400 mt-0.5">Kelola pengumuman yang tampil ke pengguna.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
            >
              {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <SearchInput value={search} onChange={setSearch} placeholder="Cari pengumuman..." />
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Plus size={15} /> Tambah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-10" />
              <col />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">#</th>
                <ColHeader label="Judul & Isi" col="judul" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Target</th>
                <ColHeader label="Tanggal" col="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Expired" col="expired_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-gray-800 truncate">{item.judul}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.isi}</p>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={item.target_role} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {item.expired_at
                      ? new Date(item.expired_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="cursor-pointer transition-colors" title="Edit">
                        <Pencil size={15} className="text-green-500 hover:text-green-600" />
                      </button>
                      <button onClick={() => setConfirmDelete(item)} className="cursor-pointer transition-colors" title="Hapus">
                        <Trash2 size={15} className="text-red-400 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <EmptyState message={search || roleFilter ? "Tidak ada hasil pencarian." : "Belum ada pengumuman."} flat />
          )}
        </div>
      </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
              <h3 className="text-base font-bold text-white">{editItem ? "Edit Pengumuman" : "Tambah Pengumuman"}</h3>
              <button onClick={closeModal} className="text-white/70 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Judul</label>
                <input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul pengumuman"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Isi</label>
                <textarea value={form.isi} onChange={e => setForm(f => ({ ...f, isi: e.target.value }))} placeholder="Tulis isi pengumuman..." rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Target Pengguna</label>
                <select value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[var(--color-primary)] transition-colors bg-white">
                  {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Expired At <span className="text-gray-400 font-normal">(opsional)</span></label>
                <input type="datetime-local" value={form.expired_at} onChange={e => setForm(f => ({ ...f, expired_at: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
            </form>
            <div className="px-5 pb-5 flex gap-3 shrink-0">
              <button type="button" onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}>
                {saving ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</> : editItem ? "Simpan Perubahan" : "Unggah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Hapus Pengumuman"
          message={`Yakin ingin menghapus pengumuman "${confirmDelete.judul}"? Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Ya, Hapus"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
