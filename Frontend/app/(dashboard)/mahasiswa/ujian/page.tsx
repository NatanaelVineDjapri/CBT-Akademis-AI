"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { getMyUjian } from "../../../../services/UjianServices";
import { useDebounce } from "../../../../hooks/useDebounce";
import { usePerPage } from "../../../../hooks/usePerPage";
import SearchInput from "../../../../components/filtering/SearchInput";
import SortButton, { SortOrder } from "../../../../components/filtering/SortButton";
import Pagination from "../../../../components/filtering/Pagination";
import UjianCard from "../../../../components/dashboard/mahasiswa/ujian/UjianCard";
import EmptyState from "../../../../components/EmptyState";
import UjianCardSkeleton from "../../../../components/skeleton/UjianCardSkeleton";

type Tab = "berlangsung" | "akan_datang" | "selesai";

const TABS: { key: Tab; label: string; status: string }[] = [
  { key: "berlangsung", label: "Berlangsung", status: "sedang_berlangsung" },
  { key: "akan_datang", label: "Akan Datang", status: "belum_mulai" },
  { key: "selesai",     label: "Selesai",     status: "selesai" },
];

export default function UjianPage() {
  const [tab, setTab] = useState<Tab>("berlangsung");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const perPage = usePerPage(245, 4, 255);

  useEffect(() => { setPage(1); }, [tab, debouncedSearch, sort]);
  useEffect(() => { setPage(1); }, [perPage]);

  const currentTab = TABS.find(t => t.key === tab)!;
  const sortDir = sort === null ? undefined : sort;

  const { data, isValidating } = useSWR(
    ["/ujian/my", currentTab.status, debouncedSearch, sortDir ?? "", page, perPage],
    ([, st, s, sd, p, pp]: [string, string, string, string, number, number]) =>
      getMyUjian({ status: st, search: s, sort_dir: (sd || undefined) as "asc" | "desc" | undefined, page: p, per_page: pp }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }
  );

  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    if (!isValidating || !data) { setShowSkeleton(false); return; }
    const t = setTimeout(() => setShowSkeleton(true), 150);
    return () => clearTimeout(t);
  }, [isValidating, data]);

  const ujianList = data?.data ?? [];
  const meta = data?.meta ?? null;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Ujian</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat dan ikuti semua ujian kamu di sini</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div className="flex p-1 rounded-full gap-1 bg-white">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={tab === t.key
                ? { backgroundColor: "var(--color-primary)", color: "white" }
                : { color: "var(--color-primary)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari ujian..." />
          <SortButton value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
        </div>
      </div>

      <div className="flex-1">
        {showSkeleton ? (
          <UjianCardSkeleton count={perPage} />
        ) : !data ? null : ujianList.length === 0 ? (
          <EmptyState message="Tidak ada ujian." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ujianList.map(u => <UjianCard key={u.peserta_ujian_id} ujian={u} />)}
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
