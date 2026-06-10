"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getBankSoalSoal } from "@/services/BankSoalServices";

export default function SharedBankSoalPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <Breadcrumb overrides={bankSoal ? { [id]: bankSoal.nama } : undefined} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              {bankSoal?.nama ?? "Bank Soal"}
            </h2>
            {bankSoal?.mata_kuliah && (
              <p className="text-xs text-gray-400 mt-0.5">{bankSoal.mata_kuliah.nama}</p>
            )}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search" />
        </div>

        <SoalTable soalList={soalList} isLoading={isLoading} canEdit={false} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </div>
  );
}