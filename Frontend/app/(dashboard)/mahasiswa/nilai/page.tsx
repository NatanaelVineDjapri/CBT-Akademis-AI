"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getNilai } from "../../../../services/NilaiServices";
import { useDebounce } from "../../../../hooks/useDebounce";
import SearchInput from "../../../../components/filtering/SearchInput";
import Pagination from "../../../../components/filtering/Pagination";
import NilaiTableSkeleton from "../../../../components/skeleton/NilaiTableSkeleton";
import EmptyState from "../../../../components/EmptyState";
import { usePerPage } from "../../../../hooks/usePerPage";

type SortBy = "nama_ujian" | "tanggal" | "nilai" | "grade";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort, center, className }: {
  label: string; col: SortBy; sortBy: SortBy; sortDir: SortDir;
  onSort: (col: SortBy) => void; center?: boolean; className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      className={`px-4 py-3 text-xs text-gray-400 font-bold cursor-pointer select-none ${center ? "text-center" : "text-left"} ${className ?? ""}`}
      onClick={() => onSort(col)}
    >
      <span className={`flex items-center gap-1 ${center ? "justify-center" : ""}`}>
        {label}
        <Icon size={12} className={active ? "text-gray-600" : "text-gray-300"} />
      </span>
    </th>
  );
}

export default function NilaiPage() {
  const perPage = usePerPage(53, 1, 400);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("tanggal");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir]);

  const handleSort = (col: SortBy) => {
    if (col === sortBy) {
      setSortDir(d => d === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const { data, isValidating } = useSWR(
    ["/nilai", debouncedSearch, page, perPage, sortBy, sortDir],
    ([, s, p, pp, sb, sd]: [string, string, number, number, SortBy, SortDir]) =>
      getNilai({ search: s, page: p, per_page: pp, sort_by: sb, sort_dir: sd }),
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }
  );

  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    if (!isValidating || !data) { setShowSkeleton(false); return; }
    const t = setTimeout(() => setShowSkeleton(true), 150);
    return () => clearTimeout(t);
  }, [isValidating, data]);

  const nilaiList = data?.data ?? [];
  const meta = data?.meta ?? null;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Nilai</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat hasil ujian dan perkembangan belajar Anda</p>
      </div>

      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden px-3 pb-2">
          <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-4">
            <h2 className="text-base font-bold shrink-0" style={{ color: "var(--color-primary)" }}>Riwayat Nilai</h2>
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari nama ujian..." />
          </div>

          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-12" />
              <col className="w-56" />
              <col className="w-32" />
              <col className="w-24" />
              <col className="w-20" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-bold">#</th>
                <ColHeader label="Nama Ujian" col="nama_ujian" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Tanggal" col="tanggal" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-bold">Pukul</th>
                <ColHeader label="Nilai" col="nilai" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Grade" col="grade" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} center />
              </tr>
            </thead>
            <tbody>
              {showSkeleton ? (
                <NilaiTableSkeleton count={perPage} />
              ) : (
                nilaiList.map((item, idx) => {
                  const no = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-400">{String(no).padStart(2, "0")}</td>
                      <td className="px-4 py-4 text-gray-700 font-medium truncate">{item.nama_ujian}</td>
                      <td className="px-4 py-4 text-gray-500">{item.tanggal}</td>
                      <td className="px-4 py-4 text-gray-500">{item.pukul}</td>
                      <td className="px-4 py-4 text-gray-700">{item.nilai}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold" style={{ color: item.lulus ? "var(--color-primary)" : "#ef4444" }}>
                          {item.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {data && !showSkeleton && nilaiList.length === 0 && (
            <div className="px-3 pb-3">
              <EmptyState message="Belum ada riwayat nilai." />
            </div>
          )}
        </div>
      </div>

      {meta && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
