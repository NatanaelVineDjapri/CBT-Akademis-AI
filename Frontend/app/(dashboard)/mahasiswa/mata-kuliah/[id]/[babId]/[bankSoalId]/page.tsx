"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getBankSoalSoal } from "@/services/BankSoalServices";

interface Props {
  params: Promise<{ id: string; babId: string; bankSoalId: string }>;
}

export default function MahasiswaBankSoalSoalPage({ params }: Props) {
  const { babId, bankSoalId } = use(params);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useSWR(
    ["/bank-soal", bankSoalId, "soal", debouncedSearch],
    () => getBankSoalSoal(Number(bankSoalId), { search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const soalList = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm mb-3 transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          <ChevronLeft size={16} /> Kembali
        </button>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          {bankSoal?.nama ?? "Daftar Soal"}
        </h1>
        {bankSoal?.bab && (
          <p className="text-sm text-gray-500 mt-1">{bankSoal.bab.nama_bab}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
            Daftar Soal
          </h2>
          <SearchInput value={search} onChange={setSearch} placeholder="Search" />
        </div>

        <SoalTable soalList={soalList} isLoading={isLoading} canEdit={false} />
      </div>
    </div>
  );
}
