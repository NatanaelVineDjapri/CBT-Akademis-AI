"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getBankSoalGlobal, getBankSoalSoal } from "@/services/BankSoalServices";
import { toSlug } from "@/utils/slug";

interface Props {
  params: Promise<{ slug: string; bab: string }>;
}

export default function GlobalBabSoalPage({ params }: Props) {
  const { slug, bab } = use(params);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data: allGlobal } = useSWR(
    "/bank-soal/global/all",
    () => getBankSoalGlobal({ per_page: 200 }),
    { revalidateOnFocus: false, revalidateIfStale: false }
  );

  const bankSoalItem = allGlobal?.data.find(item => toSlug(item.nama) === slug);
  const bankSoalId = bankSoalItem?.id;

  const { data, isLoading } = useSWR(
    bankSoalId ? ["/bank-soal", bankSoalId, "soal", bab, debouncedSearch] : null,
    () => getBankSoalSoal(bankSoalId!, { search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal ?? bankSoalItem;
  const allSoal = data?.data ?? [];
  const soalList = allSoal.filter((s) => toSlug(s.bab?.nama_bab ?? "") === bab);
  const babNama = soalList[0]?.bab?.nama_bab
    ?? allSoal.find((s) => toSlug(s.bab?.nama_bab ?? "") === bab)?.bab?.nama_bab;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb
          overrides={{
            [slug]: bankSoal?.nama ?? slug,
            [bab]: babNama ?? bab,
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

        <SoalTable soalList={soalList} isLoading={isLoading || !bankSoalId} />
      </div>
    </div>
  );
}
