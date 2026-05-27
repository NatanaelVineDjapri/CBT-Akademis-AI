"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Plus, Pencil, Trash2, X, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import { useUser } from "@/context/UserContext";
import {
  getMataKuliah,
  createMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/services/MataKuliahServices";
import { getProdi } from "@/services/AdminUserServices";
import type { MataKuliah } from "@/types";

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const SKS_OPTIONS = [1, 2, 3, 4, 5, 6];

type MatkulSortBy = "nama" | "kode" | "semester" | "sks";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort }: {
  label: string; col: MatkulSortBy; sortBy: MatkulSortBy; sortDir: SortDir;
  onSort: (col: MatkulSortBy) => void;
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

function MatkulFormModal({
  prodiList,
  initial,
  onClose,
  onSaved,
}: {
  prodiList: { id: number; nama: string }[];
  initial?: MataKuliah | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [kode, setKode] = useState(initial?.kode ?? "");
  const [prodiId, setProdiId] = useState<number | "">(initial?.prodi_id ?? "");
  const [semester, setSemester] = useState<number | "">(initial?.semester ?? "");
  const [sks, setSks] = useState<number | "">(initial?.sks ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!nama.trim() || !kode.trim()) {
      setError("Nama dan kode wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        nama: nama.trim(),
        kode: kode.trim(),
        prodi_id: prodiId !== "" ? (prodiId as number) : null,
        semester: semester !== "" ? (semester as number) : null,
        sks: sks !== "" ? (sks as number) : null,
      };
      if (initial) {
        await updateMataKuliah(initial.id, payload);
      } else {
        await createMataKuliah(payload);
      }
      onSaved();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">
            {initial ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Nama Mata Kuliah</label>
            <input
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Algoritma dan Pemrograman"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Kode</label>
            <input
              value={kode}
              onChange={e => setKode(e.target.value)}
              placeholder="TI101"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Program Studi</label>
            <select
              value={prodiId}
              onChange={e => setProdiId(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">Pilih Prodi</option>
              {prodiList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 block mb-1">Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value ? Number(e.target.value) : "")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">-</option>
                {SEMESTER_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 block mb-1">SKS</label>
              <select
                value={sks}
                onChange={e => setSks(e.target.value ? Number(e.target.value) : "")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">-</option>
                {SKS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {initial ? "Simpan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function MataKuliahPage() {
  const { user } = useUser();
  const perPage = usePerPage(53, 1, 320);
  const [search, setSearch]   = useState("");
  const [prodiId, setProdiId] = useState<number | undefined>();
  const [page, setPage]       = useState(1);
  const [sortBy, setSortBy]   = useState<MatkulSortBy>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [formModal, setFormModal] = useState<{ open: boolean; item?: MataKuliah | null }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<MataKuliah | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(search);

  const handleSort = (col: MatkulSortBy) => {
    const newDir: SortDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    setSortBy(col);
    setSortDir(newDir);
    setPage(1);
  };

  useEffect(() => { setPage(1); }, [debouncedSearch, prodiId, perPage]);

  const { data: prodiData } = useSWR(
    user?.universitas_id ? ["/prodi/matkul", user.universitas_id] : null,
    () => getProdi({ per_page: 200 }),
    { revalidateOnFocus: false }
  );

  const { data } = useSWR(
    ["/mata-kuliah", debouncedSearch, prodiId, page, perPage, sortBy, sortDir],
    ([, s, p, pg]) => getMataKuliah({ search: s as string, prodi_id: p as number | undefined, page: pg as number, per_page: perPage, sort_by: sortBy, sort_dir: sortDir }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const prodis = prodiData?.data ?? [];
  const swrKey = ["/mata-kuliah", debouncedSearch, prodiId, page, perPage, sortBy, sortDir];

  const handleSaved = () => {
    setFormModal({ open: false });
    mutate(swrKey);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      await deleteMataKuliah(deleteModal.id);
      setDeleteModal(null);
      mutate(swrKey);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0"><Breadcrumb /></div>

      <div className="flex-1">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Mata Kuliah
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Kelola daftar mata kuliah per program studi.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={prodiId ?? ""}
              onChange={e => setProdiId(e.target.value ? Number(e.target.value) : undefined)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">Semua Prodi</option>
              {prodis.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
            <SearchInput value={search} onChange={setSearch} placeholder="Cari nama / kode" />
            <button
              onClick={() => setFormModal({ open: true, item: null })}
              className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Plus size={15} />
              Tambah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
                <ColHeader label="Kode" col="kode" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Nama" col="nama" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Program Studi</th>
                <ColHeader label="Semester" col="semester" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="SKS" col="sks" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {!data ? Array.from({ length: perPage }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 animate-pulse">
                  <td className="px-5 py-3"><div className="h-3 bg-gray-100 rounded w-6" /></td>
                  <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-48" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-8" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-12" /></td>
                  <td className="px-4 py-3"><div className="flex gap-2"><div className="h-4 bg-gray-100 rounded w-4" /><div className="h-4 bg-gray-100 rounded w-4" /></div></td>
                </tr>
              )) : data.data.map((item, idx) => {
                const rowNum = String(((data.meta.current_page - 1) * data.meta.per_page) + idx + 1).padStart(2, "0");
                return (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400">{rowNum}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">{item.kode}</span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--color-primary)" }}>{item.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{(item as MataKuliah & { prodi?: { nama: string } }).prodi?.nama ?? "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.semester ?? "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.sks ? `${item.sks} SKS` : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setFormModal({ open: true, item })} className="cursor-pointer transition-colors" title="Edit">
                          <Pencil size={15} className="text-green-500 hover:text-green-600" />
                        </button>
                        <button onClick={() => setDeleteModal(item)} className="cursor-pointer transition-colors" title="Hapus">
                          <Trash2 size={15} className="text-red-400 hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {data?.data.length === 0 && <EmptyState message="Tidak ada mata kuliah." flat />}
        </div>
      </div>
      </div>

      {data?.meta && data.meta.last_page > 1 && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          total={data.meta.total}
          perPage={data.meta.per_page}
          onPageChange={setPage}
        />
      )}

      {formModal.open && (
        <MatkulFormModal
          prodiList={prodis}
          initial={formModal.item}
          onClose={() => setFormModal({ open: false })}
          onSaved={handleSaved}
        />
      )}

      {deleteModal && (
        <ConfirmModal
          title="Hapus Mata Kuliah"
          message={`${deleteModal.nama} (${deleteModal.kode}) akan dihapus permanen.`}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}
