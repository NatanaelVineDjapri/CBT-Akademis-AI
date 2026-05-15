"use client";

import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, BookOpen, CalendarDays, Clock } from "lucide-react";
import HasilUjianTableSkeleton from "@/components/skeleton/HasilUjianTableSkeleton";
import type { HasilUjianDosenItem, UjianMeta } from "@/types";

export type SortBy = "nama_ujian" | "tanggal" | "avg_nilai" | "status";
export type SortDir = "asc" | "desc";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  Selesai:     { label: "Selesai",     bg: "var(--color-primary-light)", color: "var(--color-primary)" },
  berlangsung: { label: "Berlangsung", bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  Belum_mulai: { label: "Belum Mulai", bg: "var(--akademik-tahun-bg)",   color: "var(--akademik-tahun-icon)" },
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

function ColHeader({
  label,
  col,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string;
  col: SortBy;
  sortBy: SortBy;
  sortDir: SortDir;
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

interface HasilUjianTableProps {
  items: HasilUjianDosenItem[];
  meta: UjianMeta | null;
  perPage: number;
  isLoaded: boolean;
  showSkeleton: boolean;
  sortBy: SortBy;
  sortDir: SortDir;
  onSort: (col: SortBy) => void;
  getDetailHref: (id: number) => string;
  onRowMouseEnter: (id: number) => void;
  emptyMessage?: string;
}

export default function HasilUjianTable({
  items,
  meta,
  perPage,
  isLoaded,
  showSkeleton,
  sortBy,
  sortDir,
  onSort,
  getDetailHref,
  onRowMouseEnter,
  emptyMessage = "Belum ada data ujian.",
}: HasilUjianTableProps) {
  return (
    <div className="px-6 overflow-x-auto flex-1">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 w-10">#</th>
            <ColHeader label="Nama Ujian" col="nama_ujian" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <ColHeader label="Tanggal"    col="tanggal"    sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <th className="text-left text-xs text-gray-400 font-bold px-4 py-3">Peserta</th>
            <ColHeader label="Rata-rata"  col="avg_nilai"  sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <ColHeader label="Status"     col="status"     sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            <HasilUjianTableSkeleton count={perPage} />
          ) : !isLoaded ? (
            <HasilUjianTableSkeleton count={6} />
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm text-gray-400">{emptyMessage}</td>
            </tr>
          ) : (
            items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              const no = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? perPage) + idx + 1;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className={`text-xs text-gray-400 font-semibold py-3.5 ${!isLast ? "border-b border-gray-100" : ""}`}>
                    {String(no).padStart(2, "0")}
                  </td>
                  <td className={`py-3.5 pr-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
                    <Link
                      href={getDetailHref(item.id)}
                      className="text-sm font-medium hover:underline"
                      style={{ color: "var(--color-primary)" }}
                      onMouseEnter={() => onRowMouseEnter(item.id)}
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
  );
}
