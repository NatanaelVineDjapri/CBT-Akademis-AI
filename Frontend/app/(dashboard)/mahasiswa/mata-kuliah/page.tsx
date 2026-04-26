"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import SearchInput from "../../../../components/filtering/SearchInput";
import MataKuliahCard from "../../../../components/dashboard/mahasiswa/MataKuliahCard";
import SortButton, { SortOrder } from "../../../../components/filtering/SortButton";
import Pagination from "../../../../components/filtering/Pagination";
import { getMyMataKuliah } from "../../../../services/MataKuliahServices";
import { useDebounce } from "../../../../hooks/useDebounce";
import { usePerPage } from "../../../../hooks/usePerPage";
import MataKuliahSkeleton from "../../../../components/skeleton/filtering/MataKuliahSkeleton";
import EmptyState from "../../../../components/EmptyState";

export default function MataKuliahPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>(null);
  const [page, setPage] = useState(1);
  const perPage = usePerPage(128, 4, 200);
  const debouncedSearch = useDebounce(search);

  const resetPage = (fn: (v: any) => void) => (v: any) => { fn(v); setPage(1); };

  const sortParam = sort === null ? undefined : sort;
  const { data, isLoading, isValidating } = useSWR(
    ["/mata-kuliah/my", debouncedSearch, page, perPage, sortParam ?? ""],
    ([, s, p, pp, so]: [string, string, number, number, string]) =>
      getMyMataKuliah({ search: s, page: p, per_page: pp, sort: (so || undefined) as "asc" | "desc" | undefined }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }
  );

  const mataKuliah = data?.data ?? [];
  const meta = data?.meta ?? null;

  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    if (!isValidating || !data) { setShowSkeleton(false); return; }
    const t = setTimeout(() => setShowSkeleton(true), 150);
    return () => clearTimeout(t);
  }, [isValidating, data]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
            Mata Kuliah
          </h1>
          <p className="text-sm text-gray-500 mt-1">Daftar mata kuliah yang tersedia</p>
        </div>
        <div className="flex gap-2">
          <SearchInput value={search} onChange={resetPage(setSearch)} placeholder="Cari mata kuliah..." />
          <SortButton value={sort} onChange={resetPage(setSort)} />
        </div>
      </div>

      <div className="flex-1">
        {showSkeleton ? (
          <MataKuliahSkeleton count={perPage} />
        ) : isLoading ? null : mataKuliah.length === 0 ? (
          <EmptyState message="Tidak ada mata kuliah." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mataKuliah.map((mk) => (
              <MataKuliahCard key={mk.id} mk={mk} />
            ))}
          </div>
        )}
      </div>

      {meta && (
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
