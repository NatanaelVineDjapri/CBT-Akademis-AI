"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import BankSoalTable from "@/components/bank-soal/BankSoalTable";
import AksesBankSoalGlobalCard from "@/components/bank-soal/AksesBankSoalGlobalCard";
import BankSoalSkeleton from "@/components/skeleton/BankSoalSkeleton";
import BankSoalFormModal from "@/components/bank-soal/BankSoalFormModal";
import BankSoalDeleteModal from "@/components/bank-soal/BankSoalDeleteModal";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getBankSoal,
  createBankSoal,
  updateBankSoal,
  deleteBankSoal,
} from "@/services/BankSoalServices";
import { getDosenMataKuliah } from "@/services/MataKuliahServices";
import type { BankSoalItem } from "@/types";

export default function DosenBankSoalPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const { data, mutate } = useSWR(
    ["/bank-soal", debouncedSearch, page],
    ([, s, p]: [string, string, number]) => getBankSoal({ search: s, page: p, per_page: 10 }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }
  );

  const { data: mataKuliahOptions = [] } = useSWR(
    "/mata-kuliah/dosen",
    getDosenMataKuliah,
    { revalidateOnFocus: false }
  );

  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<BankSoalItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<BankSoalItem | null>(null);

  const handleCreate = async (formData: Parameters<typeof createBankSoal>[0]) => {
    await createBankSoal(formData);
    mutate();
  };

  const handleEdit = async (formData: Parameters<typeof updateBankSoal>[1]) => {
    if (!editItem) return;
    await updateBankSoal(editItem.id, formData);
    mutate();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await deleteBankSoal(deleteItem.id);
    mutate();
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      {!data ? <BankSoalSkeleton /> : (
        <BankSoalTable
          data={data.data}
          meta={data.meta}
          search={search}
          onSearchChange={(v) => setSearch(v)}
          onPageChange={setPage}
          onEdit={(item) => setEditItem(item)}
          onDelete={(item) => setDeleteItem(item)}
          canEdit={true}
          onTambah={() => setShowCreate(true)}
        />
      )}

      <AksesBankSoalGlobalCard href="/dosen/bank-soal/global" />

      {showCreate && (
        <BankSoalFormModal
          mode="create"
          mataKuliahOptions={mataKuliahOptions}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {editItem && (
        <BankSoalFormModal
          mode="edit"
          item={editItem}
          mataKuliahOptions={mataKuliahOptions}
          onClose={() => setEditItem(null)}
          onSubmit={handleEdit}
        />
      )}

      {deleteItem && (
        <BankSoalDeleteModal
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
