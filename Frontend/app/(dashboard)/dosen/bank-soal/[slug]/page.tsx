"use client";

import { use, useState } from "react";
import useSWR, { mutate } from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getBankSoal, getBankSoalSoal, deleteSoal } from "@/services/BankSoalServices";
import type { SoalItem, SoalSortBy, SoalSortDir } from "@/services/BankSoalServices";
import ConfirmModal from "@/components/ConfirmModal";
import AddSoalModal from "@/components/soal/AddSoalModal";
import { Plus, Sparkles } from "lucide-react";
import GenerateAIModal from "@/components/soal/GenerateAIModal";
import { toSlug } from "@/utils/slug";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DaftarSoalPage({ params }: Props) {
  const { slug } = use(params);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SoalSortBy>("deskripsi");
  const [sortDir, setSortDir] = useState<SoalSortDir>("asc");
  const [showGenerateAI, setShowGenerateAI] = useState(false);
  const [showAddSoal, setShowAddSoal] = useState(false);
  const [editingSoal, setEditingSoal] = useState<SoalItem | null>(null);
  const [deletingSoal, setDeletingSoal] = useState<SoalItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

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

  const bankSoalId = allBankSoal?.data.find(item => toSlug(item.nama) === slug)?.id;

  const swrKey = bankSoalId ? ["/bank-soal", String(bankSoalId), "soal", debouncedSearch, sortBy, sortDir] : null;

  const { data, isLoading } = useSWR(
    swrKey,
    () => getBankSoalSoal(bankSoalId!, { search: debouncedSearch, sort_by: sortBy, sort_dir: sortDir }),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const soalList = data?.data ?? [];
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
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb overrides={bankSoal ? { [slug]: bankSoal.nama } : undefined} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Daftar Soal
            </h2>
            {bankSoal?.mata_kuliah && (
              <p className="text-xs text-gray-400 mt-0.5">{bankSoal.mata_kuliah.nama}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search" />
            {canEdit && (
              <>
                <button
                  onClick={() => setShowAddSoal(true)}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Plus size={15} />
                  Tambah Soal
                </button>
                <button
                  onClick={() => setShowGenerateAI(true)}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Sparkles size={15} />
                  Generate Soal dengan AI
                </button>
              </>
            )}
          </div>
        </div>

        <SoalTable
          soalList={soalList}
          isLoading={isLoading || !bankSoalId}
          canEdit={canEdit}
          onEdit={setEditingSoal}
          onDelete={(s) => setDeletingSoal(s)}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
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
            onClose={() => setShowGenerateAI(false)}
            onSaved={() => mutate(swrKey)}
          />
        )}
      </div>
    </div>
  );
}
