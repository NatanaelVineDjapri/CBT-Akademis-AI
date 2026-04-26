import Link from "next/link";
import { preload } from "swr";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getNilaiDetail } from "@/services/NilaiServices";
import type { Nilai, NilaiMeta } from "@/types";
import NilaiTableSkeleton from "@/components/skeleton/NilaiTableSkeleton";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/filtering/SearchInput";

export type SortBy = "nama_ujian" | "tanggal" | "nilai" | "grade";
export type SortDir = "asc" | "desc";

function ColHeader({
  label,
  col,
  sortBy,
  sortDir,
  onSort,
  center,
  className,
}: {
  label: string;
  col: SortBy;
  sortBy: SortBy;
  sortDir: SortDir;
  onSort: (col: SortBy) => void;
  center?: boolean;
  className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      className={`px-4 py-3 text-xs text-gray-400 font-bold cursor-pointer select-none ${center ? "text-center" : "text-left"} ${className ?? ""}`}
      onClick={() => onSort(col)}
    >
      <span
        className={`flex items-center gap-1 ${center ? "justify-center" : ""}`}
      >
        {label}
        <Icon
          size={12}
          className={active ? "text-gray-600" : "text-gray-300"}
        />
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
  nilaiList,
  meta,
  perPage,
  sortBy,
  sortDir,
  onSort,
  showSkeleton,
  search,
  onSearch,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden px-3 pb-2">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-4">
        <h2
          className="text-base font-bold shrink-0"
          style={{ color: "var(--color-primary)" }}
        >
          Riwayat Nilai
        </h2>
        <SearchInput
          value={search}
          onChange={onSearch}
          placeholder="Cari nama ujian..."
        />
      </div>

      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col className="w-12" />
          <col className="w-56" />
          <col className="w-32" />
          <col className="w-24" />
          <col className="w-20" />
          <col className="w-20" />
          {/* <col className="w-24" /> */}
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs text-gray-400 font-bold">
              #
            </th>
            <ColHeader
              label="Nama Ujian"
              col="nama_ujian"
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={onSort}
            />
            <ColHeader
              label="Tanggal"
              col="tanggal"
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={onSort}
            />
            <th className="text-left px-4 py-3 text-xs text-gray-400 font-bold">
              Pukul
            </th>
            <ColHeader
              label="Nilai"
              col="nilai"
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={onSort}
            />
            <ColHeader
              label="Grade"
              col="grade"
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={onSort}
              center
            />
            {/* <th className="px-4 py-3" /> */}
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            <NilaiTableSkeleton count={perPage} />
          ) : (
            nilaiList.map((item, idx) => {
              const no = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
              return (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 text-gray-400">
                    {String(no).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-medium truncate">
                    <Link
                      href={`/mahasiswa/nilai/${item.id}`}
                      className="hover:underline"
                      style={{ color: "var(--color-primary)" }}
                      onMouseEnter={() =>
                        preload(`/nilai/${item.id}`, () =>
                          getNilaiDetail(item.id),
                        )
                      } 
                    >
                      {item.nama_ujian}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{item.tanggal}</td>
                  <td className="px-4 py-4 text-gray-500">{item.pukul}</td>
                  <td className="px-4 py-4 text-gray-700">{item.nilai}</td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className="font-semibold"
                      style={{
                        color: item.lulus
                          ? "var(--color-primary)"
                          : "var(--color-danger, #ef4444)",
                      }}
                    >
                      {item.grade}
                    </span>
                  </td>
                 
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {!showSkeleton && nilaiList.length === 0 && (
        <div className="px-3 pb-3">
          <EmptyState message="Belum ada riwayat nilai." />
        </div>
      )}
    </div>
  );
}
