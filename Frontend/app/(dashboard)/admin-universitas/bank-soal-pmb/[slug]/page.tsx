"use client";

import { use, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import Pagination from "@/components/filtering/Pagination";
import { getBankSoal, getBankSoalSoal, deleteSoal } from "@/services/BankSoalServices";
import type { SoalItem, SoalSortBy, SoalSortDir } from "@/services/BankSoalServices";
import ConfirmModal from "@/components/ConfirmModal";
import AddSoalModal from "@/components/soal/AddSoalModal";
import GenerateAIModal from "@/components/soal/GenerateAIModal";
import { Plus, Sparkles } from "lucide-react";
import { toSlug } from "@/utils/slug";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function AdminBankSoalDetailPage({ params }: Props) {
  const { slug } = use(params);
  const perPage = usePerPage(80, 1, 280);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SoalSortBy>("deskripsi");
  const [sortDir, setSortDir] = useState<SoalSortDir>("asc");
  const [page, setPage] = useState(1);
  const [showAddSoal, setShowAddSoal] = useState(false);
  const [showGenerateAI, setShowGenerateAI] = useState(false);
  const [editingSoal, setEditingSoal] = useState<SoalItem | null>(null);
  const [deletingSoal, setDeletingSoal] = useState<SoalItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir]);

  const handleSort = (col: SoalSortBy) => {
    const newDir: SoalSortDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    setSortBy(col);
    setSortDir(newDir);
  };

  const { data: allBankSoal } = useSWR(
    "/bank-soal/all",
    () => getBankSoal({ per_page: 200 }),
    { revalidateOnFocus: false }
  );

  const bankSoalId = allBankSoal?.data.find((item: { nama: string; id: number }) => toSlug(item.nama) === slug)?.id;
  const swrKey = bankSoalId ? ["/bank-soal", String(bankSoalId), "soal", page, perPage, sortBy, sortDir, debouncedSearch] : null;

  const { data, isLoading } = useSWR(
    swrKey,
    () => getBankSoalSoal(bankSoalId!, { search: debouncedSearch, page, per_page: perPage, sort_by: sortBy, sort_dir: sortDir }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const soalList = data?.data ?? [];
  const meta = data?.meta ?? null;
  const canEdit = data?.can_edit ?? false;

  const handleConfirmDelete = async () => {
    if (!deletingSoal || !bankSoalId) return;
    setDeleting(true);
    try {
      await deleteSoal(deletingSoal.id);
      mutate(swrKey);
      setDeletingSoal(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <Breadcrumb overrides={bankSoal ? { [slug]: bankSoal.nama } : undefined} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              {bankSoal?.nama ?? "Bank Soal"}
            </h2>
            {bankSoal?.mata_kuliah && (
              <p className="text-xs text-gray-400 mt-0.5">{bankSoal.mata_kuliah.nama}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search" />
            {canEdit && (
              <>
                <button
                  onClick={() => setShowAddSoal(true)}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Plus size={15} />
                  <span className="hidden sm:inline">Tambah Soal</span>
                </button>
                <button
                  onClick={() => setShowGenerateAI(true)}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Sparkles size={15} />
                  <span className="hidden sm:inline">Generate Soal dengan AI</span>
                </button>
              </>
            )}
          </div>
        </div>

        <SoalTable
          soalList={soalList}
          isLoading={isLoading || !bankSoalId}
          canEdit={canEdit}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={setEditingSoal}
          onDelete={(soal) => setDeletingSoal(soal)}
        />

        {(showAddSoal || editingSoal) && bankSoal && (
          <AddSoalModal
            bankSoal={bankSoal}
            soal={editingSoal ?? undefined}
            onClose={() => { setShowAddSoal(false); setEditingSoal(null); }}
            onSaved={() => mutate(swrKey)}
          />
        )}

        {deletingSoal && (
          <ConfirmModal
            message={`Hapus soal "${deletingSoal.deskripsi.slice(0, 60)}..."?`}
            loading={deleting}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingSoal(null)}
          />
        )}

        {showGenerateAI && bankSoalId && (
          <GenerateAIModal
            bankSoalId={String(bankSoalId)}
            hideBabReferensi
            onClose={() => setShowGenerateAI(false)}
            onSaved={() => mutate(swrKey)}
          />
        )}
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
    </div>
  );
}
