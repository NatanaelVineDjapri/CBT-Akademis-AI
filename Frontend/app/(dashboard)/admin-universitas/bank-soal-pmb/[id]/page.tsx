"use client";

import { use, useState } from "react";
import useSWR, { mutate } from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getBankSoalSoal, deleteSoal } from "@/services/BankSoalServices";
import type { SoalItem } from "@/services/BankSoalServices";
import ConfirmModal from "@/components/ConfirmModal";
import AddSoalModal from "@/components/soal/AddSoalModal";
import GenerateAIModal from "@/components/soal/GenerateAIModal";
import { Plus, Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminBankSoalDetailPage({ params }: Props) {
  const { id } = use(params);
  const [search, setSearch] = useState("");
  const [showAddSoal, setShowAddSoal] = useState(false);
  const [showGenerateAI, setShowGenerateAI] = useState(false);
  const [editingSoal, setEditingSoal] = useState<SoalItem | null>(null);
  const [deletingSoal, setDeletingSoal] = useState<SoalItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const swrKey = ["/bank-soal", id, "soal", debouncedSearch];

  const { data, isLoading } = useSWR(
    swrKey,
    () => getBankSoalSoal(Number(id), { search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const soalList = data?.data ?? [];
  const canEdit = data?.can_edit ?? false;

  const handleConfirmDelete = async () => {
    if (!deletingSoal) return;
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
        <Breadcrumb overrides={bankSoal ? { [id]: bankSoal.nama } : undefined} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Daftar Soal PMB
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
          isLoading={isLoading}
          canEdit={canEdit}
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

        {showGenerateAI && (
          <GenerateAIModal
            bankSoalId={id}
            hideBabReferensi
            onClose={() => setShowGenerateAI(false)}
            onSaved={() => mutate(swrKey)}
          />
        )}
      </div>
    </div>
  );
}
