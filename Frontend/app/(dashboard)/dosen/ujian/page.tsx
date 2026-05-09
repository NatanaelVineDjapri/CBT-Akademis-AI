"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, BookOpen, Clock, Users, CalendarDays } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import api from "@/services/api";
import { fetcher, StatusBadge, fmt } from "@/components/dosen/ujian/constants";
import UjianModal from "@/components/dosen/ujian/UjianModal";
import { EMPTY_FORM } from "@/components/dosen/ujian/types";
import type { UjianItem, MataKuliahOption, UjianForm } from "@/components/dosen/ujian/types";

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
        />
      )}
    </div>
  );
}
