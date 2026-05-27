"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { preload } from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import Pagination from "@/components/filtering/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import SearchInput from "@/components/filtering/SearchInput";
import { getHasilUjianDosen, getDetailUjianDosen } from "@/services/UjianServices";
import { toSlug } from "@/utils/slug";
import HasilUjianTable from "@/components/ujian/HasilUjianTable";
import type { HasilUjianDosenItem, UjianMeta } from "@/types";
import type { SortBy, SortDir } from "@/components/ujian/HasilUjianTable";

export default function DosenHasilUjianPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const perPage = usePerPage(53, 1, 480);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>((searchParams.get("sort_by") as SortBy) ?? "tanggal");
  const [sortDir, setSortDir] = useState<SortDir>((searchParams.get("sort_dir") as SortDir) ?? "desc");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir]);
  useEffect(() => { setPage(1); }, [perPage]);

  const handleSort = (col: SortBy) => {
    const newDir: SortDir = col === sortBy ? (sortDir === "desc" ? "asc" : "desc") : "desc";
    setSortBy(col);
    setSortDir(newDir);
    router.replace(`/dosen/hasil-ujian?sort_by=${col}&sort_dir=${newDir}`, { scroll: false });
  };

  const { data, isValidating } = useSWR(
    ["/ujian/dosen/hasil", debouncedSearch, page, perPage, sortBy, sortDir],
    ([, s, p, pp, sb, sd]: [string, string, number, number, SortBy, SortDir]) =>
      getHasilUjianDosen({ search: s, page: p, per_page: pp, sort_by: sb, sort_dir: sd }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }
  );

  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    if (!isValidating || !data) { setShowSkeleton(false); return; }
    const t = setTimeout(() => setShowSkeleton(true), 150);
    return () => clearTimeout(t);
  }, [isValidating, data]);

  const items: HasilUjianDosenItem[] = data?.data ?? [];
  const meta: UjianMeta | null = data?.meta ?? null;

  return (
    <div className="flex flex-col gap-4 h-full">
      <Breadcrumb />

      <div className="flex-1">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Hasil Ujian</h2>
              <p className="text-xs text-gray-400 mt-0.5">Lihat hasil dan statistik ujian yang telah selesai.</p>
            </div>
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Cari ujian..." />
          </div>

        <HasilUjianTable
          items={items}
          meta={meta}
          perPage={perPage}
          isLoaded={!!data}
          showSkeleton={showSkeleton}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          getDetailHref={(_, nama) => `/dosen/hasil-ujian/${toSlug(nama)}`}
          onRowMouseEnter={id => preload(`/ujian/dosen/hasil/${id}`, () => getDetailUjianDosen(id))}
        />
        </div>
      </div>

      {meta && (meta.last_page ?? 1) > 1 && (
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
