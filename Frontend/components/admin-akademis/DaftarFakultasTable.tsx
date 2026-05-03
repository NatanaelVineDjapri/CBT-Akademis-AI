"use client";

import { useState } from "react";
import useSWR from "swr";
import { Pencil, Trash2, X } from "lucide-react";
import { getFakultas, deleteFakultas, FakultasItem } from "@/services/FakultasService";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/filtering/Pagination";

interface Props {
  universitasId: number;
  onEdit: (item: FakultasItem) => void;
  refreshKey: number;
}

const PER_PAGE = 10;

export default function DaftarFakultasTable({ universitasId, onEdit, refreshKey }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<FakultasItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, mutate } = useSWR(
    ["/fakultas", universitasId, debouncedSearch, page, refreshKey],
    () => getFakultas({ universitas_id: universitasId, search: debouncedSearch || undefined, page, per_page: PER_PAGE }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFakultas(deleteTarget.id);
      mutate();
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between gap-3 flex-wrap shrink-0">
          <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>Daftar Fakultas</span>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5"/>
              <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau kode..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 outline-none w-52 focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 w-10">#</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5">Fakultas</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 w-20 text-center">Prodi</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 w-20 text-center">Mahasiswa</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 w-20 text-center">Dosen</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-3.5 border-b border-gray-100">
                        <div className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: j === 0 ? 24 : j === 5 ? 48 : "70%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-gray-400">Belum ada fakultas terdaftar.</td>
                </tr>
              ) : data.data.map((item, i) => {
                const isLast = i === data.data.length - 1;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className={`text-xs text-gray-400 font-semibold py-3.5 ${!isLast ? "border-b border-gray-100" : ""}`}>
                      {String((page - 1) * PER_PAGE + i + 1).padStart(2, "0")}
                    </td>
                    <td className={`py-3.5 ${!isLast ? "border-b border-gray-100" : ""}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                          {item.kode.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium leading-tight">{item.nama}</p>
                          <p className="text-xs text-gray-400">{item.kode}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`text-sm text-gray-700 font-medium py-3.5 text-center ${!isLast ? "border-b border-gray-100" : ""}`}>{item.prodi_count ?? 0}</td>
                    <td className={`text-sm text-gray-700 font-medium py-3.5 text-center ${!isLast ? "border-b border-gray-100" : ""}`}>{item.total_mahasiswa ?? 0}</td>
                    <td className={`text-sm text-gray-700 font-medium py-3.5 text-center ${!isLast ? "border-b border-gray-100" : ""}`}>{item.total_dosen ?? 0}</td>
                    <td className={`py-3.5 ${!isLast ? "border-b border-gray-100" : ""}`}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEdit(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-blue-50"
                          title="Edit"
                        >
                          <Pencil size={14} style={{ color: "var(--color-primary)" }} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(data?.meta?.last_page ?? 1) > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination
              currentPage={page}
              lastPage={data?.meta?.last_page ?? 1}
              total={data?.meta?.total ?? 0}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
              <h3 className="text-base font-bold text-white">Hapus Fakultas</h3>
              <button onClick={() => setDeleteTarget(null)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">
                Yakin ingin menghapus fakultas <span className="font-semibold text-gray-800">"{deleteTarget.nama}"</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
