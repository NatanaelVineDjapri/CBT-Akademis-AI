"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { BookOpen, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchInput from "@/components/filtering/SearchInput";
import { getBankSoalMy, type BankSoalMyItem } from "@/services/BankSoalServices";
import { toSlug } from "@/utils/slug";

type SortBy = "nama" | "soal_count";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort, className }: {
  label: string; col: SortBy; sortBy: SortBy; sortDir: SortDir;
  onSort: (col: SortBy) => void; className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      className={`text-left text-xs text-gray-400 font-medium px-4 py-3 cursor-pointer select-none whitespace-nowrap ${className ?? ""}`}
      onClick={() => onSort(col)}
    >
      <span className="flex items-center gap-1">
        {label}
        <Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} />
      </span>
    </th>
  );
}

export default function MahasiswaSharedBankSoalPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const debouncedSearch = useDebounce(search);

  const handleSort = (col: SortBy) => {
    const newDir: SortDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    setSortBy(col);
    setSortDir(newDir);
  };

  const { data, isLoading } = useSWR(
    ["/bank-soal/my", debouncedSearch, sortBy, sortDir],
    () => getBankSoalMy({ search: debouncedSearch, sort_by: sortBy, sort_dir: sortDir }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const list = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Shared</h1>
        <p className="text-sm text-gray-500 mt-1">Bank soal yang dibagikan kepada Anda</p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Daftar Bank Soal</h2>
            <p className="text-xs text-gray-400 mt-0.5">Klik bank soal untuk melihat daftar soal.</p>
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari bank soal..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
                <ColHeader label="Nama Bank Soal" col="nama" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 whitespace-nowrap">Mata Kuliah</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 whitespace-nowrap">Dibuat Oleh</th>
                <ColHeader label="Jumlah Soal" col="soal_count" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-5 py-3"><div className="h-3 w-6 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-28 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-28 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded" /></td>
                    <td />
                  </tr>
                ))
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                    {search ? "Bank soal tidak ditemukan." : "Belum ada bank soal yang dibagikan."}
                  </td>
                </tr>
              ) : (
                list.map((bs: BankSoalMyItem, idx: number) => (
                  <tr key={bs.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-3">
                      <Link href={`/mahasiswa/bank-soal/${toSlug(bs.nama)}`} className="flex items-center gap-2 group">
                        <BookOpen size={13} className="text-gray-300 shrink-0" />
                        <span className="font-medium group-hover:underline" style={{ color: "var(--color-primary)" }}>{bs.nama}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{bs.mata_kuliah ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{bs.creator ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-600">{bs.soal_count}</td>
                    <td className="px-4 py-3 text-right"><ChevronRight size={14} className="text-gray-300" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
