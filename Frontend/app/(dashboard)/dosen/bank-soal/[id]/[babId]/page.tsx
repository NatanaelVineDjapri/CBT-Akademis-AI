"use client";

import { use, useState } from "react";
import useSWR, { mutate } from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import AddSoalModal from "@/components/soal/AddSoalModal";
import GenerateAIModal from "@/components/soal/GenerateAIModal";
import { getBankSoalSoal, deleteSoal } from "@/services/BankSoalServices";
import type { SoalItem } from "@/services/BankSoalServices";
import { Plus, Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ id: string; babId: string }>;
}

export default function BabSoalPage({ params }: Props) {
  const { id, babId } = use(params);
  const [search, setSearch] = useState("");
  const [showAddSoal, setShowAddSoal] = useState(false);
  const [showGenerateAI, setShowGenerateAI] = useState(false);
  const [editingSoal, setEditingSoal] = useState<SoalItem | null>(null);
  const debouncedSearch = useDebounce(search);

  const swrKey = ["/bank-soal", id, "soal", babId, debouncedSearch];

  const { data, isLoading } = useSWR(
    swrKey,
    () => getBankSoalSoal(Number(id), { search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const allSoal = data?.data ?? [];
  const soalList = allSoal.filter((s) => s.bab?.id === Number(babId));
  const canEdit = data?.can_edit ?? false;
  const babNama = soalList[0]?.bab?.nama_bab
    ?? allSoal.find((s) => s.bab?.id === Number(babId))?.bab?.nama_bab;

  const handleDelete = async (soal: SoalItem) => {
    if (!confirm(`Hapus soal "${soal.deskripsi.slice(0, 50)}..."?`)) return;
    await deleteSoal(soal.id);
    mutate(swrKey);
  };

  const handleSaved = () => {
    mutate(swrKey);
    mutate(["/bank-soal", id, "bab-list"]);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb
          overrides={{
            [id]: bankSoal?.nama ?? id,
            [babId]: babNama ?? `Bab ${babId}`,
          }}
        />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Daftar Soal
            </h2>
            {babNama && <p className="text-xs text-gray-400 mt-0.5">{babNama}</p>}
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
          onDelete={handleDelete}
        />

        {showAddSoal && bankSoal && (
          <AddSoalModal
            bankSoal={bankSoal}
            defaultBabId={Number(babId)}
            onClose={() => setShowAddSoal(false)}
            onSaved={handleSaved}
          />
        )}

        {editingSoal && bankSoal && (
          <AddSoalModal
            bankSoal={bankSoal}
            defaultBabId={Number(babId)}
            onClose={() => setEditingSoal(null)}
            onSaved={handleSaved}
          />
        )}

        {showGenerateAI && (
          <GenerateAIModal
            bankSoalId={id}
            onClose={() => setShowGenerateAI(false)}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
