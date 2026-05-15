"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import api from "@/services/api";
import UjianModal from "@/components/dosen/ujian/UjianModal";
import UjianTable from "@/components/ujian/UjianTable";
import ConfirmModal from "@/components/ConfirmModal";
import { EMPTY_FORM } from "@/components/dosen/ujian/types";
import type { UjianItem, UjianForm } from "@/components/dosen/ujian/types";

const API_PATH = "/ujian/pmb";

export default function AdminUjianPmbPage() {
  const [search, setSearch]               = useState("");
  const [page, setPage]                   = useState(1);
  const [modal, setModal]                 = useState<{ mode: "create" | "edit"; form: UjianForm } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UjianItem | null>(null);
  const [deleting, setDeleting]           = useState(false);
  const debouncedSearch                   = useDebounce(search);
  const perPage                           = usePerPage(53, 1, 450);

  useEffect(() => { setPage(1); }, [debouncedSearch, perPage]);

  const { data, isLoading, mutate } = useSWR(
    [API_PATH, page, debouncedSearch, perPage],
    () => api.get(API_PATH, { params: { page, per_page: perPage, search: debouncedSearch } }).then(r => r.data),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const items: UjianItem[] = data?.data ?? [];
  const meta = data?.meta;

  const openCreate = () => setModal({ mode: "create", form: EMPTY_FORM });

  const openEdit = async (item: UjianItem) => {
    try {
      const res = await api.get(`${API_PATH}/${item.id}`);
      const d = res.data.data;
      setModal({
        mode: "edit",
        form: {
          id:            d.id,
          nama_ujian:    d.nama_ujian,
          mata_kuliah_id: "",
          durasi_menit:  String(d.durasi_menit ?? ""),
          passing_grade: String(d.passing_grade ?? ""),
          max_attempt:   String(d.max_attempt ?? "1"),
          start_date:    d.start_date ? d.start_date.slice(0, 16) : "",
          end_date:      d.end_date   ? d.end_date.slice(0, 16)   : "",
          kode_akses:    d.kode_akses ?? "",
          is_kode_aktif: d.is_kode_aktif ?? false,
        },
      });
    } catch {
      alert("Gagal membuka data ujian.");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`${API_PATH}/${confirmDelete.id}`);
      setConfirmDelete(null);
      mutate();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Gagal menghapus.");
    } finally { setDeleting(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <div><Breadcrumb /></div>

      <div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Manajemen Ujian PMB</h2>
              <p className="text-xs text-gray-400 mt-0.5">Buat dan kelola ujian untuk penerimaan mahasiswa baru.</p>
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

          <UjianTable
            items={items}
            perPage={perPage}
            isLoading={isLoading}
            meta={meta}
            onEdit={openEdit}
            onDelete={setConfirmDelete}
          />
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
          matkulList={[]}
          apiPath={API_PATH}
          requiresMataKuliah={false}
          onClose={() => { setModal(null); mutate(); }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Hapus Ujian"
          message={`Yakin ingin menghapus ujian "${confirmDelete.nama_ujian}"? Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Ya, Hapus"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
