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
import { usePerPage } from "@/hooks/usePerPage";
import {
  getBankSoal,
  createBankSoal,
  updateBankSoal,
  deleteBankSoal,
} from "@/services/BankSoalServices";
import ShareByEmailModal from "@/components/bank-soal/ShareByEmailModal";
import { getDosenMataKuliah } from "@/services/MataKuliahServices";
import type { BankSoalItem } from "@/types";

export default function DosenBankSoalPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"nama" | "soal_count" | "updated_at" | "permission">("updated_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const debouncedSearch = useDebounce(search);
  const perPage = usePerPage(57, 1, 530);

  const handleSort = (col: typeof sortBy) => {
    const newDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : (col === "updated_at" ? "desc" : "asc");
    setSortBy(col);
    setSortDir(newDir);
    setPage(1);
  };

  useEffect(() => { setPage(1); }, [debouncedSearch, perPage]);

  const { data, mutate } = useSWR(
    ["/bank-soal", debouncedSearch, page, perPage, sortBy, sortDir],
    () => getBankSoal({ search: debouncedSearch, page, per_page: perPage, sort_by: sortBy, sort_dir: sortDir }),
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
  const [shareItem, setShareItem] = useState<BankSoalItem | null>(null);
  const [shareLink, setShareLink] = useState<string | undefined>();

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
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div className="flex-1">
        {!data ? <BankSoalSkeleton /> : (
          <BankSoalTable
            data={data.data}
            meta={data.meta}
            search={search}
            onSearchChange={(v) => setSearch(v)}
            onPageChange={setPage}
            onEdit={(item) => setEditItem(item)}
            onDelete={(item) => setDeleteItem(item)}
            onShare={(item, link) => { setShareItem(item); setShareLink(link); }}
            canEdit={true}
            onTambah={() => setShowCreate(true)}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
          />
        )}
      </div>

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

      {shareItem && (
        <ShareByEmailModal
          item={shareItem}
          onClose={() => { setShareItem(null); setShareLink(undefined); }}
          initialLink={shareLink}
        />
      )}
    </div>
  );
}
