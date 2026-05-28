"use client";

import { use, useEffect, useState } from "react";
import useSWR, { preload } from "swr";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import ConfirmModal from "@/components/ConfirmModal";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import { getUniversitas } from "@/services/UniversitasService";
import {
  getFakultas, getFakultasById, createFakultas, updateFakultas, deleteFakultas, FakultasItem,
} from "@/services/FakultasService";
import { getProdi } from "@/services/ProdiService";
import { useDebounce } from "@/hooks/useDebounce";
import { toSlug } from "@/utils/slug";

const PER_PAGE = 10;
const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] transition-colors";

function FakultasModal({ universitasId, editItem, onClose, onSaved }: {
  universitasId: number;
  editItem: FakultasItem | null;
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
      if (isEdit) await updateFakultas(editItem!.id, { nama: form.nama.trim(), kode: form.kode.trim() });
      else await createFakultas({ universitas_id: universitasId, nama: form.nama.trim(), kode: form.kode.trim() });
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
          <h3 className="text-base font-bold text-white">{isEdit ? "Edit Fakultas" : "Tambah Fakultas"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Fakultas <span className="text-red-400">*</span></label>
            <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Fakultas Teknik" required className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kode <span className="text-red-400">*</span></label>
            <input value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value.toUpperCase() }))} placeholder="FT" required className={inputClass + " uppercase"} />
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

interface Props { params: Promise<{ slug: string }>; }

export default function UniversitasDetailPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<FakultasItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FakultasItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data: allUniv } = useSWR(
    "/universitas/all",
    () => getUniversitas({ per_page: 200 }),
    { revalidateOnFocus: false }
  );

  const univ = allUniv?.data.find(u => toSlug(u.nama) === slug);
  const univId = univ?.id;

  const { data, isLoading, mutate } = useSWR(
    univId ? ["/fakultas", univId, debouncedSearch, page] : null,
    () => getFakultas({ universitas_id: univId!, search: debouncedSearch || undefined, page, per_page: PER_PAGE }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFakultas(deleteTarget.id);
      setDeleteTarget(null);
      mutate();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb overrides={{ [slug]: univ?.nama ?? "..." }} />

      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Daftar Fakultas</h2>
            <p className="text-xs text-gray-400 mt-0.5">{univ?.nama ?? "..."}</p>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearch} placeholder="Cari fakultas..." />
            <button
              onClick={() => { setEditItem(null); setShowModal(true); }}
              className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Plus size={15} />
              Tambah Baru
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-12" />
              <col />
              <col className="w-24" />
              <col className="w-24" />
              <col className="w-20" />
              <col className="w-24" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Fakultas</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Prodi</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Mahasiswa</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Dosen</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || !univId ? (
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-5 py-3"><div className="h-3 w-6 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-12 bg-gray-100 rounded" /></td>
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">Belum ada fakultas terdaftar.</td>
                </tr>
              ) : data.data.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin-akademis/institusi/${slug}/${toSlug(item.nama)}`)}
                  onMouseEnter={() => {
                    router.prefetch(`/admin-akademis/institusi/${slug}/${toSlug(item.nama)}`);
                    preload(["/fakultas/all", univId], () => getFakultas({ universitas_id: univId!, per_page: 200 }));
                    preload(["/prodi", item.id, "", 1], () => getProdi({ fakultas_id: item.id, page: 1, per_page: PER_PAGE }));
                  }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                >
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
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium text-center">{item.prodi_count ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium text-center">{item.total_mahasiswa ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium text-center">{item.total_dosen ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); setEditItem(item); setShowModal(true); }}
                        className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteTarget(item); }}
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

      {showModal && univId && (
        <FakultasModal
          universitasId={univId}
          editItem={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSaved={() => mutate()}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Hapus Fakultas"
          message={`Yakin ingin menghapus fakultas "${deleteTarget.nama}"? Tindakan ini tidak dapat dibatalkan.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
