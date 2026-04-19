"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getBankSoalSoal } from "@/services/BankSoalServices";
import { Plus, Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function DaftarSoalPage({ params }: Props) {
  const { id } = use(params);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useSWR(
    ["/bank-soal", id, "soal", debouncedSearch],
    () => getBankSoalSoal(Number(id), { search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const soalList = data?.data ?? [];
  const canEdit = data?.can_edit ?? false;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb overrides={bankSoal ? { [id]: bankSoal.nama } : undefined} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1">
        {/* Header */}
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
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Plus size={15} />
                  Tambah Soal
                </button>
                <button
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 80%, black)" }}
                >
                  <Sparkles size={15} />
                  Generate Soal dengan AI
                </button>
              </>
            )}
          </div>
        </div>

        <SoalTable soalList={soalList} isLoading={isLoading} canEdit={canEdit} />
      </div>
    </div>
  );
}
