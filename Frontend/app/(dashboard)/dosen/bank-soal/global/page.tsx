"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import BankSoalGlobalCard from "@/components/bank-soal/BankSoalGlobalCard";
import BankSoalGlobalSkeleton from "@/components/skeleton/BankSoalGlobalSkeleton";
import Pagination from "@/components/filtering/Pagination";
import SearchInput from "@/components/filtering/SearchInput";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import { getBankSoalGlobal } from "@/services/BankSoalServices";
import { useUser } from "@/context/UserContext";

export default function BankSoalGlobalPage() {
  const { user } = useUser();
  const perPage = usePerPage(290, 4, 240);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch]);
  useEffect(() => { setPage(1); }, [perPage]);

  const { data } = useSWR(
    ["/bank-soal/global", debouncedSearch, page, perPage],
    ([, s, p, pp]: [string, string, number, number]) => getBankSoalGlobal({ search: s, page: p, per_page: pp }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      {/* White container */}
      <div className="bg-white rounded-2xl overflow-hidden flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Bank Soal Global
            </h2>
            {user?.universitas_nama && (
              <p className="text-xs text-gray-400 mt-0.5">Diakses oleh: {user.universitas_nama}</p>
            )}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search" />
        </div>

        {/* Cards */}
        <div className="p-5">
          {!data ? (
            <BankSoalGlobalSkeleton count={perPage} />
          ) : data.data.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">Tidak ada bank soal publik.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {data.data.map((item) => (
                <BankSoalGlobalCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {data?.meta && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          total={data.meta.total}
          perPage={data.meta.per_page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
