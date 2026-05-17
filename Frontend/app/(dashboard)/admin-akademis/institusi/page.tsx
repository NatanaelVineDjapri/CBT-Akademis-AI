"use client";

import { use, useEffect, useRef, useState } from "react";
import useSWR, { preload } from "swr";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import ConfirmModal from "@/components/ConfirmModal";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import {
  getUniversitas, getUniversitasById, createUniversitas, updateUniversitas, deleteUniversitas,
  UniversitasItem,
} from "@/services/UniversitasService";
import { getFakultas } from "@/services/FakultasService";
import { useDebounce } from "@/hooks/useDebounce";

const PER_PAGE = 10;
const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] transition-colors";

function UniversitasModal({ editItem, onClose, onSaved }: {
  editItem: UniversitasItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ nama: "", kode: "", alamat: "" });
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!editItem;

  useEffect(() => {
    if (editItem) {
      setForm({ nama: editItem.nama, kode: editItem.kode, alamat: editItem.alamat ?? "" });
      setPreview(editItem.logo ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${editItem.logo}` : null);
      setLogo(null);
    } else {
      setForm({ nama: "", kode: "", alamat: "" });
      setPreview(null);
      setLogo(null);
    }
    setError(null);
  }, [editItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.kode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("nama", form.nama.trim());
      fd.append("kode", form.kode.trim());
      if (form.alamat.trim()) fd.append("alamat", form.alamat.trim());
      if (logo) fd.append("logo", logo);
      if (isEdit) await updateUniversitas(editItem!.id, fd);
      else await createUniversitas(fd);
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
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">{isEdit ? "Edit Universitas" : "Tambah Universitas"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Universitas <span className="text-red-400">*</span></label>
            <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Universitas Tarumanagara" required className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kode <span className="text-red-400">*</span></label>
            <input value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value.toUpperCase() }))} placeholder="UNTAR" required className={inputClass + " uppercase"} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Alamat</label>
            <input value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} placeholder="Jl. S. Parman No.1, Jakarta Barat" className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Logo</label>
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} alt="preview" className="w-10 h-10 rounded-lg object-contain border border-gray-100 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                  {form.kode ? form.kode.slice(0, 1) : "?"}
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} className="text-white text-sm px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--color-primary)" }}>
                Pilih File
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={e => { const f = e.target.files?.[0] ?? null; setLogo(f); setPreview(f ? URL.createObjectURL(f) : null); }} className="hidden" />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">PNG, JPG maks. 2MB</p>
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

export default function InstitusiPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<UniversitasItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UniversitasItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, mutate } = useSWR(
    ["/universitas", debouncedSearch, page],
    () => getUniversitas({ search: debouncedSearch || undefined, page, per_page: PER_PAGE }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUniversitas(deleteTarget.id);
      setDeleteTarget(null);
      mutate();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb />

      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Daftar Universitas</h2>
            <p className="text-xs text-gray-400 mt-0.5">Kelola data universitas yang terdaftar.</p>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearch} placeholder="Cari universitas..." />
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

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Universitas</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Alamat</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Fakultas</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Mahasiswa</th>
                <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">Dosen</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-5 py-3"><div className="h-3 w-6 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-32 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-12 bg-gray-100 rounded" /></td>
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">Belum ada universitas terdaftar.</td>
                </tr>
              ) : data.data.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin-akademis/institusi/${item.id}`)}
                  onMouseEnter={() => {
                    router.prefetch(`/admin-akademis/institusi/${item.id}`);
                    preload(`/universitas/${item.id}`, () => getUniversitasById(item.id));
                    preload(["/fakultas", item.id, "", 1], () => getFakultas({ universitas_id: item.id, page: 1, per_page: PER_PAGE }));
                  }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {String((page - 1) * PER_PAGE + idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {item.logo ? (
                        <img src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.logo}`} alt={item.nama} className="w-7 h-7 rounded-md object-contain border border-gray-100 shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                          {item.kode.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-tight truncate">{item.nama}</p>
                        <p className="text-xs text-gray-400">{item.kode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <span className="line-clamp-2">{item.alamat || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium text-center">{item.fakultas_count ?? 0}</td>
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

      {showModal && (
        <UniversitasModal
          editItem={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSaved={() => mutate()}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Hapus Universitas"
          message={`Yakin ingin menghapus universitas "${deleteTarget.nama}"? Tindakan ini tidak dapat dibatalkan.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
