"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { getNilai } from "../../../../services/NilaiServices";
import { useDebounce } from "../../../../hooks/useDebounce";
import { usePerPage } from "../../../../hooks/usePerPage";
import Pagination from "../../../../components/filtering/Pagination";
import NilaiTable, { type SortBy, type SortDir } from "../../../../components/dashboard/mahasiswa/NilaiTable";

export default function NilaiPage() {
  const perPage = usePerPage(53, 1, 300);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("tanggal");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir]);

  const handleSort = (col: SortBy) => {
    if (col === sortBy) {
      setSortDir(d => d === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const { data, isValidating } = useSWR(
    ["/nilai", debouncedSearch, page, perPage, sortBy, sortDir],
    ([, s, p, pp, sb, sd]: [string, string, number, number, SortBy, SortDir]) =>
      getNilai({ search: s, page: p, per_page: pp, sort_by: sb, sort_dir: sd }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }
  );

  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    if (!isValidating || !data) { setShowSkeleton(false); return; }
    const t = setTimeout(() => setShowSkeleton(true), 150);
    return () => clearTimeout(t);
  }, [isValidating, data]);

  const nilaiList = data?.data ?? [];
  const meta = data?.meta ?? null;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Nilai</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat hasil ujian dan perkembangan belajar Anda</p>
      </div>

      <div className="flex-1">
        <NilaiTable
          nilaiList={nilaiList}
          meta={meta}
          perPage={perPage}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          showSkeleton={showSkeleton}
          search={search}
          onSearch={(v) => { setSearch(v); setPage(1); }}
        />
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
