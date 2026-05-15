"use client";

import { BookOpen, CalendarDays, Clock, Users, Pencil, Trash2 } from "lucide-react";
import { StatusBadge, fmt } from "@/components/dosen/ujian/constants";
import EmptyState from "@/components/EmptyState";
import type { UjianItem } from "@/components/dosen/ujian/types";

interface UjianTableProps {
  items: UjianItem[];
  perPage: number;
  isLoading: boolean;
  meta?: { current_page: number; per_page: number };
  onEdit: (item: UjianItem) => void;
  onDelete: (item: UjianItem) => void;
}

export default function UjianTable({ items, perPage, isLoading, meta, onEdit, onDelete }: UjianTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nama Ujian</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Jadwal</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Durasi</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Soal</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Peserta</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-16">Aksi</th>
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
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                <td className="px-4 py-3">
                  <p className="font-medium" style={{ color: "var(--color-primary)" }}>{item.nama_ujian}</p>
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
