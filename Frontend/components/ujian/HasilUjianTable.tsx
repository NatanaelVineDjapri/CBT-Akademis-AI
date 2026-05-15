"use client";

import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, BookOpen, CalendarDays, Clock, Users } from "lucide-react";
import { fmt } from "@/components/dosen/ujian/constants";
import HasilUjianTableSkeleton from "@/components/skeleton/HasilUjianTableSkeleton";
import EmptyState from "@/components/EmptyState";
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

function ColHeader({ label, col, sortBy, sortDir, onSort, className = "" }: {
  label: string; col: SortBy; sortBy: SortBy; sortDir: SortDir; onSort: (col: SortBy) => void; className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      className={`text-left text-xs text-gray-400 font-medium px-4 py-3 cursor-pointer select-none ${className}`}
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
  items, meta, perPage, isLoaded, showSkeleton, sortBy, sortDir, onSort,
  getDetailHref, onRowMouseEnter, emptyMessage = "Belum ada data ujian.",
}: HasilUjianTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
            <ColHeader label="Nama Ujian" col="nama_ujian" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <ColHeader label="Jadwal"     col="tanggal"    sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Durasi</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Soal</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Peserta</th>
            <ColHeader label="Rata-rata"  col="avg_nilai"  sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <ColHeader label="Status"     col="status"     sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            <HasilUjianTableSkeleton count={perPage} />
          ) : !isLoaded ? (
            <HasilUjianTableSkeleton count={6} />
          ) : items.map((item, idx) => {
            const no = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? perPage) + idx + 1;
            return (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                <td className="px-4 py-3">
                  <Link
                    href={getDetailHref(item.id)}
                    className="font-medium hover:underline"
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarDays size={11} className="text-gray-400 shrink-0" />
                    <span>{fmt(item.start_date)}</span>
                  </div>
                  {item.end_date && (
                    <div className="text-xs text-gray-400 mt-0.5 pl-3.5">s/d {fmt(item.end_date)}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={11} className="text-gray-400" />
                    <span>{item.durasi_menit} mnt</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700 font-medium">{item.jumlah_soal}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={11} className="text-gray-400" />
                    <span>{item.peserta_count}</span>
                  </div>
                  {item.total_lulus > 0 && (
                    <div className="text-xs text-gray-400 pl-3.5">{item.total_lulus} lulus</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {item.avg_nilai !== null ? (
                    <span className="font-semibold" style={{ color: "var(--color-primary)" }}>{item.avg_nilai}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!showSkeleton && isLoaded && items.length === 0 && <EmptyState message={emptyMessage} flat />}
    </div>
  );
}
