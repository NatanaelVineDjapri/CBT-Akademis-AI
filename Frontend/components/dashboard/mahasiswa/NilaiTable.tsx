"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { preload } from "swr";
import { ArrowUpDown, ArrowUp, ArrowDown, BookOpen, X } from "lucide-react";
import { getNilaiDetail } from "@/services/NilaiServices";
import type { Nilai, NilaiAttempt, NilaiMeta } from "@/types";
import NilaiTableSkeleton from "@/components/skeleton/NilaiTableSkeleton";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/filtering/SearchInput";
import { getBarColor } from "@/utils/nilai";

export type SortBy = "nama_ujian" | "tanggal" | "nilai" | "grade";
export type SortDir = "asc" | "desc";

function ColHeader({
  label, col, sortBy, sortDir, onSort, className,
}: {
  label: string; col: SortBy; sortBy: SortBy; sortDir: SortDir;
  onSort: (col: SortBy) => void; className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`text-left text-xs text-gray-400 font-medium px-4 py-3 cursor-pointer select-none ${className ?? ""}`}
      onClick={() => onSort(col)}>
      <span className="flex items-center gap-1">
        {label}
        <Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} />
      </span>
    </th>
  );
}

function StatusBadge({ lulus }: { lulus: boolean }) {
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={lulus
        ? { backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }
        : { backgroundColor: "#fee2e2", color: "#ef4444" }}>
      {lulus ? "Lulus" : "Tidak Lulus"}
    </span>
  );
}

function AttemptModal({ nama, attempts, onClose }: {
  nama: string;
  attempts: NilaiAttempt[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
          <div>
            <p className="text-sm font-bold text-white">{nama}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{attempts.length}x attempt</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/20">
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-16">Attempt</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Tanggal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nilai</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Grade</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a, i) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400 font-medium">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-700">{a.tanggal}</p>
                    <p className="text-xs text-gray-400">{a.pukul}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: getBarColor(a.nilai) }}>
                    {a.nilai ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold" style={{ color: a.lulus ? "var(--color-primary)" : "#ef4444" }}>
                      {a.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge lulus={a.lulus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface Props {
  nilaiList: Nilai[];
  meta: NilaiMeta | null;
  perPage: number;
  sortBy: SortBy;
  sortDir: SortDir;
  onSort: (col: SortBy) => void;
  showSkeleton: boolean;
  search: string;
  onSearch: (v: string) => void;
}

export default function NilaiTable({
  nilaiList, meta, perPage, sortBy, sortDir, onSort, showSkeleton, search, onSearch,
}: Props) {
  const [modal, setModal] = useState<{ nama: string; attempts: NilaiAttempt[] } | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Riwayat Nilai</h2>
            <p className="text-xs text-gray-400 mt-0.5">Semua hasil ujian yang telah Anda ikuti.</p>
          </div>
          <SearchInput value={search} onChange={onSearch} placeholder="Cari nama ujian..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
                <ColHeader label="Nama Ujian" col="nama_ujian" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                <ColHeader label="Tanggal" col="tanggal" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                <ColHeader label="Nilai" col="nilai" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                <ColHeader label="Grade" col="grade" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Attempt</th>
              </tr>
            </thead>
            <tbody>
              {showSkeleton ? (
                <NilaiTableSkeleton count={perPage} />
              ) : nilaiList.map((item, idx) => {
                const no = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
                const hasMultiple = (item.attempt_count ?? 1) > 1;

                return (
                  <Fragment key={item.id}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/mahasiswa/nilai/${item.id}`}
                          className="font-medium hover:underline"
                          style={{ color: "var(--color-primary)" }}
                          onMouseEnter={() => preload(`/nilai/${item.id}`, () => getNilaiDetail(item.id))}
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
                        <p className="text-xs text-gray-700">{item.tanggal}</p>
                        <p className="text-xs text-gray-400">{item.pukul}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{item.nilai ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold"
                          style={{ color: item.lulus ? "var(--color-primary)" : "#ef4444" }}>
                          {item.grade ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge lulus={item.lulus} /></td>
                      <td className="px-4 py-3">
                        {hasMultiple ? (
                          <button
                            onClick={() => setModal({ nama: item.nama_ujian, attempts: item.attempts })}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full transition-colors hover:opacity-80"
                            style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}
                          >
                            {item.attempt_count}x
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">1x</span>
                        )}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {!showSkeleton && nilaiList.length === 0 && (
            <EmptyState message="Belum ada riwayat nilai." flat />
          )}
        </div>
      </div>

      {modal && (
        <AttemptModal
          nama={modal.nama}
          attempts={modal.attempts}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
