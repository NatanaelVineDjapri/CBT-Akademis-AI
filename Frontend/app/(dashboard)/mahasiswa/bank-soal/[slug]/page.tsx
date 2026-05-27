"use client";

import { use, useState, useEffect } from "react";
import useSWR from "swr";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import Pagination from "@/components/filtering/Pagination";
import { getBankSoalMy, getBankSoalSoal } from "@/services/BankSoalServices";
import type { SoalSortBy, SoalSortDir } from "@/services/BankSoalServices";
import { toSlug } from "@/utils/slug";

export default function SharedBankSoalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const perPage = usePerPage(80, 1, 280);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SoalSortBy>("deskripsi");
  const [sortDir, setSortDir] = useState<SoalSortDir>("asc");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir]);

  const handleSort = (col: SoalSortBy) => {
    const newDir: SoalSortDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    setSortBy(col);
    setSortDir(newDir);
  };

  const { data: myList } = useSWR(
    "/bank-soal/my",
    () => getBankSoalMy(),
    { revalidateOnFocus: false }
  );

  const bankSoalId = myList?.data.find(item => toSlug(item.nama) === slug)?.id;

  const { data, isLoading } = useSWR(
    bankSoalId ? ["/bank-soal", String(bankSoalId), "soal", page, perPage, sortBy, sortDir, debouncedSearch] : null,
    () => getBankSoalSoal(bankSoalId!, { search: debouncedSearch, page, per_page: perPage, sort_by: sortBy, sort_dir: sortDir }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const soalList = data?.data ?? [];
  const meta = data?.meta ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Bank Soal</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat daftar soal dalam bank soal ini</p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              {bankSoal?.nama ?? "Bank Soal"}
            </h2>
            {bankSoal?.mata_kuliah && (
              <p className="text-xs text-gray-400 mt-0.5">{bankSoal.mata_kuliah.nama}</p>
            )}
          </div>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search" />
        </div>

        <SoalTable
          soalList={soalList}
          isLoading={isLoading || !bankSoalId}
          canEdit={false}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
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