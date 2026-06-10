"use client";

import { useState } from "react";
import { FileText, Image, Pencil, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";
import SoalTableSkeleton from "@/components/skeleton/SoalTableSkeleton";
import type { SoalItem, SoalSortBy, SoalSortDir } from "@/services/BankSoalServices";

interface Props {
  soalList: SoalItem[];
  isLoading: boolean;
  canEdit?: boolean;
  onEdit?: (soal: SoalItem) => void;
  onDelete?: (soal: SoalItem) => void;
  sortBy?: SoalSortBy;
  sortDir?: SoalSortDir;
  onSort?: (col: SoalSortBy) => void;
}

function SortIcon({ col, sortBy, sortDir }: { col: SoalSortBy; sortBy?: SoalSortBy; sortDir?: SoalSortDir }) {
  if (sortBy !== col) return <ChevronUp size={12} className="text-gray-300 ml-1 shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="ml-1 shrink-0" style={{ color: "var(--color-primary)" }} />
    : <ChevronDown size={12} className="ml-1 shrink-0" style={{ color: "var(--color-primary)" }} />;
}

const jenisLabel: Record<string, string> = {
  pilihan_ganda: "Pilihan Ganda",
  essay: "Essay",
  checklist: "Checklist",
};

const kesulitanColor: Record<string, string> = {
  mudah: "text-green-500",
  sedang: "text-yellow-500",
  sulit: "text-red-500",
};

export default function SoalTable({ soalList, isLoading, canEdit = false, onEdit, onDelete, sortBy, sortDir, onSort }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
    {lightbox && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={() => setLightbox(null)}>
        <button className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
          onClick={() => setLightbox(null)}>
          <X size={24} />
        </button>
        <img src={lightbox} alt="Gambar soal"
          className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
          onClick={e => e.stopPropagation()} />
      </div>
    )}
    <div className="overflow-x-auto flex-1">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">
              {onSort ? (
                <button onClick={() => onSort('deskripsi')} className="flex items-center hover:text-gray-600 transition-colors cursor-pointer">
                  Soal <SortIcon col="deskripsi" sortBy={sortBy} sortDir={sortDir} />
                </button>
              ) : "Soal"}
            </th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 whitespace-nowrap">Jenis Soal</th>
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 whitespace-nowrap">
              {onSort ? (
                <button onClick={() => onSort('tingkat_kesulitan')} className="flex items-center hover:text-gray-600 transition-colors cursor-pointer">
                  Tingkat <SortIcon col="tingkat_kesulitan" sortBy={sortBy} sortDir={sortDir} />
                </button>
              ) : "Jawaban"}
            </th>
            {onSort && (
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 whitespace-nowrap">Jawaban</th>
            )}
            <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 whitespace-nowrap">Media Soal</th>
            {canEdit && (
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SoalTableSkeleton canEdit={canEdit} />
          ) : soalList.length === 0 ? (
            <tr>
              <td colSpan={canEdit ? (onSort ? 7 : 6) : (onSort ? 6 : 5)} className="px-5 py-12 text-center text-sm text-gray-400">
                Belum ada soal yang terdaftar.
              </td>
            </tr>
          ) : (
            soalList.map((soal, idx) => {
              const jenis = soal.jenis_soal?.[0];
              const jenisNama = jenisLabel[jenis?.jenis_soal ?? ""] ?? jenis?.jenis_soal ?? "-";
              const hasMedia = soal.media_soal?.length > 0;

              return (
                <tr key={soal.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {String(idx + 1).padStart(2, "0")}
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-gray-800 line-clamp-2 text-sm">{soal.deskripsi}</p>
                    {!onSort && (
                      <span className={`text-xs font-medium ${kesulitanColor[soal.tingkat_kesulitan] ?? "text-gray-400"}`}>
                        {soal.tingkat_kesulitan}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <FileText size={13} className="text-gray-300 shrink-0" />
                      {jenisNama}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {onSort ? (
                      <span className={`text-xs font-medium ${kesulitanColor[soal.tingkat_kesulitan] ?? "text-gray-400"}`}>
                        {soal.tingkat_kesulitan}
                      </span>
                    ) : jenis?.jenis_soal === "essay" ? (
                      <span className="text-xs text-gray-400 italic">Essay</span>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {(jenis?.opsi_jawaban ?? []).map((opsi) => (
                          <div key={opsi.id} className="flex items-start gap-1.5 text-xs">
                            <span
                              className="shrink-0 font-semibold w-4"
                              style={{ color: opsi.is_correct ? "var(--color-primary)" : "#9ca3af" }}
                            >
                              {opsi.opsi}.
                            </span>
                            <span
                              className={opsi.is_correct ? "font-medium" : "text-gray-400"}
                              style={{ color: opsi.is_correct ? "var(--color-primary)" : undefined }}
                            >
                              {opsi.teks}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  {onSort && (
                    <td className="px-4 py-3">
                      {jenis?.jenis_soal === "essay" ? (
                        <span className="text-xs text-gray-400 italic">Essay</span>
                      ) : (jenis?.opsi_jawaban ?? []).length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          {(jenis.opsi_jawaban ?? []).map((opsi) => (
                            <div key={opsi.id} className="flex items-start gap-1.5 text-xs">
                              <span
                                className="shrink-0 font-semibold w-4"
                                style={{ color: opsi.is_correct ? "var(--color-primary)" : "#9ca3af" }}
                              >{opsi.opsi}.</span>
                              <span
                                className={opsi.is_correct ? "font-medium" : "text-gray-400"}
                                style={{ color: opsi.is_correct ? "var(--color-primary)" : undefined }}
                              >{opsi.teks}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  )}

                  <td className="px-4 py-3">
                    {hasMedia ? (
                      <button
                        onClick={() => setLightbox(soal.media_soal[0].url)}
                        className="flex items-center gap-1 text-xs cursor-pointer hover:opacity-70 transition-opacity"
                        style={{ color: "var(--color-primary)" }}>
                        <Image size={13} />
                        Lihat Gambar
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>

                  {canEdit && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit?.(soal)}
                          className="text-green-500 hover:text-green-600 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onDelete?.(soal)}
                          className="text-red-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
    </>
  );
}
