import Link from "next/link";
import { preload } from "swr";
import { ArrowUpDown, ArrowUp, ArrowDown, BookOpen } from "lucide-react";
import { getNilaiDetail } from "@/services/NilaiServices";
import type { Nilai, NilaiMeta } from "@/types";
import NilaiTableSkeleton from "@/components/skeleton/NilaiTableSkeleton";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/filtering/SearchInput";

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
  return (
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
            </tr>
          </thead>
          <tbody>
            {showSkeleton ? (
              <NilaiTableSkeleton count={perPage} />
            ) : nilaiList.map((item, idx) => {
              const no = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
              return (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/mahasiswa/nilai/${item.id}`}
                      className="font-medium text-gray-800 hover:underline"
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
                  <td className="px-4 py-3">
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={item.lulus
                        ? { backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }
                        : { backgroundColor: "#fee2e2", color: "#ef4444" }}>
                      {item.lulus ? "Lulus" : "Tidak Lulus"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!showSkeleton && nilaiList.length === 0 && (
          <EmptyState message="Belum ada riwayat nilai." flat />
        )}
      </div>
    </div>
  );
}
