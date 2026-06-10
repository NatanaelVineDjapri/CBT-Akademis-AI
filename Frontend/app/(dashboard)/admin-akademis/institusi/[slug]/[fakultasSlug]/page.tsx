"use client";

import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import ConfirmModal from "@/components/ConfirmModal";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import { getUniversitas } from "@/services/UniversitasService";
import { getFakultas } from "@/services/FakultasService";
import { getProdi, createProdi, updateProdi, deleteProdi, ProdiItem } from "@/services/ProdiService";
import { useDebounce } from "@/hooks/useDebounce";
import { toSlug } from "@/utils/slug";

const PER_PAGE = 10;
const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] transition-colors";

function ProdiModal({ fakultasId, editItem, onClose, onSaved }: {
  fakultasId: number;
  editItem: ProdiItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ nama: "", kode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!editItem;

  useEffect(() => {
    setForm(editItem ? { nama: editItem.nama, kode: editItem.kode } : { nama: "", kode: "" });
    setError(null);
  }, [editItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.kode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (isEdit) await updateProdi(editItem!.id, { nama: form.nama.trim(), kode: form.kode.trim() });
      else await createProdi({ fakultas_id: fakultasId, nama: form.nama.trim(), kode: form.kode.trim() });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">{isEdit ? "Edit Program Studi" : "Tambah Program Studi"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Program Studi <span className="text-red-400">*</span></label>
            <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Teknik Informatika" required className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kode <span className="text-red-400">*</span></label>
            <input value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value.toUpperCase() }))} placeholder="TI" required className={inputClass + " uppercase"} />
          </div>
          {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 cursor-pointer" style={{ backgroundColor: "var(--color-primary)" }}>
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambahkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface Props { params: Promise<{ slug: string; fakultasSlug: string }>; }

export default function FakultasDetailPage({ params }: Props) {
  const { slug, fakultasSlug } = use(params);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ProdiItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProdiItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data: allUniv } = useSWR(
    "/universitas/all",
    () => getUniversitas({ per_page: 200 }),
    { revalidateOnFocus: false }
  );

  const univ = allUniv?.data.find(u => toSlug(u.nama) === slug);
  const univId = univ?.id;

  const { data: allFakultas } = useSWR(
    univId ? ["/fakultas/all", univId] : null,
    () => getFakultas({ universitas_id: univId!, per_page: 200 }),
    { revalidateOnFocus: false }
  );

  const fakultas = allFakultas?.data.find(f => toSlug(f.nama) === fakultasSlug);
  const fakultasId = fakultas?.id;

  const { data, isLoading, mutate } = useSWR(
    fakultasId ? ["/prodi", fakultasId, debouncedSearch, page] : null,
    () => getProdi({ fakultas_id: fakultasId!, search: debouncedSearch || undefined, page, per_page: PER_PAGE }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProdi(deleteTarget.id);
      setDeleteTarget(null);
      mutate();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb
        overrides={{
          [slug]: univ?.nama ?? "...",
          [fakultasSlug]: fakultas?.nama ?? "...",
        }}
      />

      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Daftar Program Studi</h2>
            <p className="text-xs text-gray-400 mt-0.5">{fakultas?.nama ?? "..."}</p>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearch} placeholder="Cari program studi..." />
            <button
              onClick={() => { setEditItem(null); setShowModal(true); }}
              className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Tambah Baru</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm table-fixed">
            <colgroup>
              <col className="w-12" />
              <col />
              <col className="w-24" />
              <col className="w-20" />
              <col className="w-24" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Program Studi</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Mahasiswa</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Dosen</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || !fakultasId ? (
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-5 py-3"><div className="h-3 w-6 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-12 bg-gray-100 rounded" /></td>
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">Belum ada program studi terdaftar.</td>
                </tr>
              ) : data.data.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {String((page - 1) * PER_PAGE + idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                        {item.kode.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 leading-tight">{item.nama}</p>
                        <p className="text-xs text-gray-400">{item.kode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium text-center">{item.total_mahasiswa ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium text-center">{item.total_dosen ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditItem(item); setShowModal(true); }}
                        className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.meta.last_page > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 shrink-0">
            <Pagination
              currentPage={page}
              lastPage={data.meta.last_page}
              total={data.meta.total}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {showModal && fakultasId && (
        <ProdiModal
          fakultasId={fakultasId}
          editItem={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSaved={() => mutate()}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Hapus Program Studi"
          message={`Yakin ingin menghapus program studi "${deleteTarget.nama}"? Tindakan ini tidak dapat dibatalkan.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
