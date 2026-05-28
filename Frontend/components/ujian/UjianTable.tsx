"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, Clock, Users, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toSlug } from "@/utils/slug";
import { StatusBadge, fmt } from "@/components/dosen/ujian/constants";
import EmptyState from "@/components/EmptyState";
import type { UjianItem } from "@/components/dosen/ujian/types";

export type UjianSortBy = "nama_ujian" | "start_date" | "jumlah_soal" | "jumlah_peserta";
export type UjianSortDir = "asc" | "desc";

interface UjianTableProps {
  items: UjianItem[];
  perPage: number;
  isLoading: boolean;
  meta?: { current_page: number; per_page: number };
  onEdit: (item: UjianItem) => void;
  onDelete: (item: UjianItem) => void;
  basePath?: string;
  onRowHover?: (item: UjianItem) => void;
  sortBy?: UjianSortBy;
  sortDir?: UjianSortDir;
  onSort?: (col: UjianSortBy) => void;
}

function ColHeader({ label, col, sortBy, sortDir, onSort, className }: {
  label: string; col: UjianSortBy;
  sortBy?: UjianSortBy; sortDir?: UjianSortDir;
  onSort?: (col: UjianSortBy) => void; className?: string;
}) {
  if (!onSort) return <th className={`text-left text-xs text-gray-400 font-medium px-4 py-3 whitespace-nowrap ${className ?? ""}`}>{label}</th>;
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`text-left text-xs text-gray-400 font-medium px-4 py-3 cursor-pointer select-none whitespace-nowrap ${className ?? ""}`} onClick={() => onSort(col)}>
      <span className="flex items-center gap-1">{label}<Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} /></span>
    </th>
  );
}

export default function UjianTable({ items, perPage, isLoading, meta, onEdit, onDelete, basePath, onRowHover, sortBy, sortDir, onSort }: UjianTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col className="w-12" />
          <col className="w-56" />
          <col className="w-40" />
          <col className="w-24" />
          <col className="w-20" />
          <col className="w-20" />
          <col className="w-28" />
          <col className="w-20" />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">#</th>
            <ColHeader label="Nama Ujian" col="nama_ujian" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <ColHeader label="Jadwal" col="start_date" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Durasi</th>
            <ColHeader label="Soal" col="jumlah_soal" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <ColHeader label="Peserta" col="jumlah_peserta" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: perPage }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50 animate-pulse">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                ))}
              </tr>
            ))
          ) : items.map((item, idx) => {
            const no = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? perPage) + idx + 1;
            return (
              <tr key={item.id} onMouseEnter={() => onRowHover?.(item)} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                <td className="px-4 py-3">
                  {basePath ? (
                    <Link href={`${basePath}/${toSlug(item.nama_ujian)}/soal`} className="font-medium hover:underline" style={{ color: "var(--color-primary)" }}>
                      {item.nama_ujian}
                    </Link>
                  ) : (
                    <p className="font-medium" style={{ color: "var(--color-primary)" }}>{item.nama_ujian}</p>
                  )}
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
                    <span>{item.jumlah_peserta}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(item)} className="transition-colors cursor-pointer" title="Edit">
                      <Pencil size={15} className="text-green-500 hover:text-green-600" />
                    </button>
                    <button onClick={() => onDelete(item)} className="transition-colors cursor-pointer" title="Hapus">
                      <Trash2 size={15} className="text-red-400 hover:text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!isLoading && items.length === 0 && <EmptyState message="Belum ada ujian." flat />}
    </div>
  );
}
