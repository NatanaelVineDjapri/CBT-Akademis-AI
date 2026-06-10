"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { preload } from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import Pagination from "@/components/filtering/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import { getHasilUjianAdminUniversitas, getDetailUjianAdminUniversitas } from "@/services/UjianServices";
import { toSlug } from "@/utils/slug";
import HasilUjianTable from "@/components/ujian/HasilUjianTable";
import type { HasilUjianDosenItem, UjianMeta } from "@/types";
import type { SortBy, SortDir } from "@/components/ujian/HasilUjianTable";

export default function AdminHasilUjianPMBPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const perPage = usePerPage(53, 1, 395);
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
    router.replace(`/admin-universitas/hasil-ujian-pmb?sort_by=${col}&sort_dir=${newDir}`, { scroll: false });
  };

  const { data, isValidating } = useSWR(
    ["/ujian/admin-universitas/hasil", debouncedSearch, page, perPage, sortBy, sortDir],
    ([, s, p, pp, sb, sd]: [string, string, number, number, SortBy, SortDir]) =>
      getHasilUjianAdminUniversitas({ search: s, page: p, per_page: pp, sort_by: sb, sort_dir: sd }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false },
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
    <div className="flex flex-col gap-4">
      <Breadcrumb />

      <div>
      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Hasil Ujian PMB</h2>
            <p className="text-xs text-gray-400 mt-0.5">Lihat hasil dan statistik ujian penerimaan mahasiswa baru.</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5"/>
              <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Cari ujian..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 outline-none w-full sm:w-52 focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
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
          getDetailHref={(_, nama) => `/admin-universitas/hasil-ujian-pmb/${toSlug(nama)}`}
          onRowMouseEnter={id => preload(`/ujian/admin-universitas/hasil/${id}`, () => getDetailUjianAdminUniversitas(id))}
          emptyMessage="Belum ada data ujian PMB."
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
