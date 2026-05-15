"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { preload } from "swr";
import { ArrowUpDown, ArrowUp, ArrowDown, BookOpen, CalendarDays, Clock } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import Pagination from "@/components/filtering/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import {
  getHasilUjianAdminUniversitas,
  getDetailUjianAdminUniversitas,
} from "@/services/UjianServices";
import HasilUjianTableSkeleton from "@/components/skeleton/HasilUjianTableSkeleton";
import type { HasilUjianDosenItem, UjianMeta } from "@/types";

type SortBy = "nama_ujian" | "tanggal" | "avg_nilai" | "status";
type SortDir = "asc" | "desc";

function ColHeader({
  label,
  col,
  sortBy,
  sortDir,
  onSort,
  className = "",
}: {
  label: string;
  col: SortBy;
  sortBy: SortBy;
  sortDir: SortDir;
  onSort: (col: SortBy) => void;
  className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      className={`text-left text-xs text-gray-400 font-bold px-4 py-3 cursor-pointer select-none ${className}`}
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
  Selesai: {
    label: "Selesai",
    bg: "var(--color-primary-light)",
    color: "var(--color-primary)",
  },
  berlangsung: {
    label: "Berlangsung",
    bg: "var(--color-warning-light)",
    color: "var(--color-warning)",
  },
  Belum_mulai: {
    label: "Belum Mulai",
    bg: "var(--akademik-tahun-bg)",
    color: "var(--akademik-tahun-icon)",
  },
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

export default function AdminHasilUjianPMBPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const perPage = usePerPage(53, 1, 395);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>(
    (searchParams.get("sort_by") as SortBy) ?? "tanggal",
  );
  const [sortDir, setSortDir] = useState<SortDir>(
    (searchParams.get("sort_dir") as SortDir) ?? "desc",
  );
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

      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="px-6 pt-5 pb-3 flex items-center justify-between gap-3 flex-wrap shrink-0">
          <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>Hasil Ujian PMB</span>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5"/>
              <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Cari ujian..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 outline-none w-52 focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>

        <div className="px-6 overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 w-10">#</th>
                <ColHeader label="Nama Ujian" col="nama_ujian" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Tanggal" col="tanggal" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
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
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-gray-400">Belum ada data ujian PMB.</td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const isLast = idx === items.length - 1;
                  const no = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className={`text-xs text-gray-400 font-semibold py-3.5 ${!isLast ? "border-b border-gray-100" : ""}`}>
                        {String(no).padStart(2, "0")}
                      </td>
                      <td className={`py-3.5 pr-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
                        <Link
                          href={`/admin-universitas/hasil-ujian-pmb/${item.id}`}
                          className="text-sm font-medium hover:underline"
                          style={{ color: "var(--color-primary)" }}
                          onMouseEnter={() => preload(`/ujian/admin-universitas/hasil/${item.id}`, () => getDetailUjianAdminUniversitas(item.id))}
                        >
                          {item.nama_ujian}
                        </Link>
                        {item.mata_kuliah && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <BookOpen size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{item.mata_kuliah}</span>
                          </div>
                        )}
                      </td>
                      <td className={`py-3.5 pr-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarDays size={11} className="text-gray-400 shrink-0" />
                          <span>{item.tanggal}</span>
                        </div>
                        {item.pukul && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 pl-0.5">
                            <Clock size={11} className="shrink-0" />
                            <span>{item.pukul}</span>
                          </div>
                        )}
                      </td>
                      <td className={`px-4 py-3.5 pr-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
                        <span className="text-sm text-gray-700 font-medium">{item.peserta_count}</span>
                        {item.total_lulus > 0 && (
                          <div className="text-xs text-gray-400">{item.total_lulus} lulus</div>
                        )}
                      </td>
                      <td className={`px-4 py-3.5 ${!isLast ? "border-b border-gray-100" : ""}`}>
                        {item.avg_nilai !== null ? (
                          <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{item.avg_nilai}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className={`py-3.5 ${!isLast ? "border-b border-gray-100" : ""}`}>
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {meta && (meta.last_page ?? 1) > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
