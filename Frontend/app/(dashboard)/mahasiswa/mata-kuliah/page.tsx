"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import SearchInput from "../../../../components/filtering/SearchInput";
import SortButton, { SortOrder } from "../../../../components/filtering/SortButton";
import Pagination from "../../../../components/filtering/Pagination";
import { getMyMataKuliah } from "../../../../services/MataKuliahServices";
import { useDebounce } from "../../../../hooks/useDebounce";
import { usePerPage } from "../../../../hooks/usePerPage";
import MataKuliahSkeleton from "../../../../components/skeleton/filtering/MataKuliahSkeleton";

export default function MataKuliahPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>(null);
  const [page, setPage] = useState(1);
  const perPage = usePerPage(230, 4);
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
    <div className="flex flex-col h-full">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 shrink-0">
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

      <div className="flex-1 overflow-hidden">
        {showSkeleton ? (
          <MataKuliahSkeleton count={perPage} />
        ) : isLoading ? null : mataKuliah.length === 0 ? (
          <p className="text-sm text-gray-400">Tidak ada mata kuliah.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mataKuliah.map((mk) => {
              const dosenNama = mk.dosen_matkul?.[0]?.user?.nama ?? "-";
              return (
                <div
                  key={mk.id}
                  className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-gray-100"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: "var(--color-primary-light)" }} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-gray-800 break-words">{mk.nama}</p>
                    <p className="text-xs text-gray-400">Dosen Pengurus:</p>
                    <p className="text-xs text-gray-600">{dosenNama}</p>
                  </div>
                  <button
                    className="mt-auto w-full py-2 rounded-lg text-white text-xs font-medium"
                    style={{ background: "var(--color-primary)" }}
                  >
                    Telusuri Bank Soal Terkait
                  </button>
                </div>
              );
            })}
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
