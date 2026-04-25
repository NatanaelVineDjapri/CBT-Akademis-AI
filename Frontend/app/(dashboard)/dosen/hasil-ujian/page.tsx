"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import { getHasilUjianDosen } from "@/services/UjianServices";
import HasilUjianTableSkeleton from "@/components/skeleton/HasilUjianTableSkeleton";
import type { HasilUjianDosenItem, UjianMeta } from "@/types";

type SortBy = "nama_ujian" | "tanggal" | "avg_nilai" | "status";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort }: {
  label: string; col: SortBy; sortBy: SortBy; sortDir: SortDir;
  onSort: (col: SortBy) => void;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      className="text-left text-xs text-gray-400 font-bold px-4 py-3 cursor-pointer select-none"
      onClick={() => onSort(col)}
    >
      <span className="flex items-center gap-1">
        {label}
        <Icon size={12} className={active ? "text-gray-600" : "text-gray-300"} />
      </span>
    </th>
  );
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  Selesai:     { label: "Selesai",      bg: "var(--color-primary-light)",  color: "var(--color-primary)" },
  berlangsung: { label: "Berlangsung",  bg: "var(--color-warning-light)",  color: "var(--color-warning)" },
  Belum_mulai: { label: "Belum Mulai",  bg: "var(--akademik-tahun-bg)",    color: "var(--akademik-tahun-icon)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span
      className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}


export default function DosenHasilUjianPage() {
  const perPage = usePerPage(53, 1, 395);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("tanggal");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir]);
  useEffect(() => { setPage(1); }, [perPage]);

  const handleSort = (col: SortBy) => {
    if (col === sortBy) {
      setSortDir(d => d === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
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
    <div className="flex flex-col h-full gap-4  ">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold shrink-0" style={{ color: "var(--color-primary)" }}>
              Hasil Ujian
            </h2>
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Cari ujian..."
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-10" />
                <col className="w-52" />
                <col className="w-44" />
                <col className="w-28" />
                <col className="w-24" />
                <col className="w-20" />
                <col className="w-24" />
                <col className="w-24" />
                <col className="w-28" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-bold px-5 py-3">#</th>
                  <ColHeader label="Nama Ujian" col="nama_ujian" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="text-left text-xs text-gray-400 font-bold px-4 py-3">Mata Kuliah</th>
                  <th className="text-left text-xs text-gray-400 font-bold px-4 py-3">Jenis</th>
                  <ColHeader label="Tanggal" col="tanggal" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <th className="text-left text-xs text-gray-400 font-bold px-4 py-3">Pukul</th>
                  <th className="text-left text-xs text-gray-400 font-bold px-4 py-3">Peserta</th>
                  <ColHeader label="Rata-rata" col="avg_nilai" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <ColHeader label="Status" col="status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {showSkeleton ? (
                  <HasilUjianTableSkeleton count={perPage} />
                ) : !data ? (
                  <HasilUjianTableSkeleton count={6} />
                ) : items.length === 0 ? null : (
                  items.map((item, idx) => {
                    const no = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
                    return (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                        <td className="px-4 py-4 font-medium text-gray-800 truncate">{item.nama_ujian}</td>
                        <td className="px-4 py-4 text-gray-500 truncate">{item.mata_kuliah}</td>
                        <td className="px-4 py-4 text-gray-500">{item.jenis_ujian}</td>
                        <td className="px-4 py-4 text-gray-500">{item.tanggal}</td>
                        <td className="px-4 py-4 text-gray-500">{item.pukul}</td>
                        <td className="px-4 py-4 text-gray-600">
                          <span className="font-medium">{item.peserta_count}</span>
                          {item.total_lulus > 0 && (
                            <span className="text-xs text-gray-400 ml-1">({item.total_lulus} lulus)</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {item.avg_nilai !== null ? (
                            <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
                              {item.avg_nilai}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {!showSkeleton && data && items.length === 0 && (
              <EmptyState message="Belum ada data ujian." />
            )}
          </div>
        </div>
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
