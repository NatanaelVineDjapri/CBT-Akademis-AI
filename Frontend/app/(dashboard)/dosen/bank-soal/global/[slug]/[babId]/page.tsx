"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getBankSoalSoal } from "@/services/BankSoalServices";

interface Props {
  params: Promise<{ slug: string; babId: string }>;
}

function extractId(slug: string): number {
  const parts = slug.split("-");
  return Number(parts[parts.length - 1]);
}

export default function GlobalBabSoalPage({ params }: Props) {
  const { slug, babId } = use(params);
  const bankSoalId = extractId(slug);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useSWR(
    ["/bank-soal", bankSoalId, "soal", babId, debouncedSearch],
    () => getBankSoalSoal(bankSoalId, { search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const allSoal = data?.data ?? [];
  const soalList = allSoal.filter((s) => s.bab?.id === Number(babId));
  const babNama = soalList[0]?.bab?.nama_bab
    ?? allSoal.find((s) => s.bab?.id === Number(babId))?.bab?.nama_bab;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb
          overrides={{
            [slug]: bankSoal?.nama ?? slug,
            [babId]: babNama ?? `Bab ${babId}`,
          }}
        />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Daftar Soal
            </h2>
            {babNama && (
              <p className="text-xs text-gray-400 mt-0.5">{babNama}</p>
            )}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search" />
        </div>

        <SoalTable soalList={soalList} isLoading={isLoading} />
      </div>
    </div>
  );
}
