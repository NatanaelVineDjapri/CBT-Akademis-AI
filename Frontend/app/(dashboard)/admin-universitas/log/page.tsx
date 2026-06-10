"use client";

import { useState } from "react";
import useSWR from "swr";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getAudits, AuditModel, AuditEvent } from "@/services/AuditService";
import Breadcrumb from "@/components/BreadCrumb";
import Pagination from "@/components/filtering/Pagination";
import { usePerPage } from "@/hooks/usePerPage";
import { useDebounce } from "@/hooks/useDebounce";

type LogSortBy = "created_at" | "event" | "auditable_type";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort, className }: {
  label: string; col: LogSortBy;
  sortBy: LogSortBy; sortDir: SortDir;
  onSort: (col: LogSortBy) => void;
  className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`text-left text-xs font-semibold text-gray-500 pb-2.5 cursor-pointer select-none whitespace-nowrap ${className ?? ""}`}
      onClick={() => onSort(col)}>
      <span className="flex items-center gap-1">{label}<Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} /></span>
    </th>
  );
}

export default function SystemLog() {
  const [search, setSearch]           = useState("");
  const [filterModel, setFilterModel] = useState<AuditModel | "">("");
  const [filterEvent, setFilterEvent] = useState<AuditEvent | "">("");
  const [page, setPage]               = useState(1);
  const [sortBy, setSortBy]           = useState<LogSortBy>("created_at");
  const [sortDir, setSortDir]         = useState<SortDir>("desc");

  const debouncedSearch = useDebounce(search);
  const perPage = usePerPage(52, 1, 310);

  const handleSort = (col: LogSortBy) => {
    if (col === sortBy) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir(col === "created_at" ? "desc" : "asc");
    }
    setPage(1);
  };

  const { data, isLoading } = useSWR(
    ["/audit", filterModel, filterEvent, debouncedSearch, page, perPage, sortBy, sortDir],
    () => getAudits({
      ...(filterModel ? { model: filterModel } : {}),
      ...(filterEvent ? { event: filterEvent } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir,
    }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const handleFilter = (cb: () => void) => { cb(); setPage(1); };

  const badgeClass = (event: string) => {
    if (event === "created") return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700";
    if (event === "updated") return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700";
    if (event === "deleted") return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700";
    return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-7 pt-6 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3 shrink-0">
          <h2 className="text-base font-bold text-[var(--color-primary)]">System Log</h2>

          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={filterModel}
              onChange={(e) => handleFilter(() => setFilterModel(e.target.value as AuditModel | ""))}
              className="px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-500 outline-none bg-white cursor-pointer focus:border-[var(--color-primary)]"
            >
              <option value="">Semua Model</option>
              <option value="user">Pengguna</option>
              <option value="nilai_akhir">Nilai Akhir</option>
              <option value="ujian">Ujian</option>
              <option value="peserta_ujian">Peserta Ujian</option>
              <option value="soal">Soal</option>
              <option value="pmb_penerimaan">Penerimaan PMB</option>
            </select>

            <select
              value={filterEvent}
              onChange={(e) => handleFilter(() => setFilterEvent(e.target.value as AuditEvent | ""))}
              className="px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-500 outline-none bg-white cursor-pointer focus:border-[var(--color-primary)]"
            >
              <option value="">Semua Event</option>
              <option value="created">Dibuat</option>
              <option value="updated">Diperbarui</option>
              <option value="deleted">Dihapus</option>
            </select>

            <div className="relative w-full sm:w-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" />
                <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Cari keterangan, user..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 outline-none bg-white w-full sm:w-56 focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="px-7 overflow-x-auto flex-1">
          <table className="w-full min-w-[760px] border-collapse table-fixed">
            <colgroup>
              <col className="w-[55%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[23%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 pl-0.5">Keterangan</th>
                <ColHeader label="Model" col="auditable_type" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Event" col="event" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Waktu & Aktor" col="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-1.5 border-b border-gray-100"><div className="h-3.5 bg-gray-100 rounded-full w-4/5 animate-pulse" /></td>
                    <td className="py-3.5 px-1.5 border-b border-gray-100"><div className="h-3 bg-gray-100 rounded-full w-20 animate-pulse" /></td>
                    <td className="py-3.5 px-1.5 border-b border-gray-100"><div className="h-5 bg-gray-100 rounded-full w-16 animate-pulse" /></td>
                    <td className="py-3.5 px-1.5 border-b border-gray-100"><div className="h-3 bg-gray-100 rounded-full w-28 animate-pulse" /></td>
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-gray-400">Tidak ada log ditemukan.</td>
                </tr>
              ) : (
                data.data.map((log, i) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className={`text-sm text-gray-800 py-3.5 px-1.5 leading-relaxed ${i < data.data.length - 1 ? "border-b border-gray-100" : ""}`}>
                      {log.keterangan}
                    </td>
                    <td className={`py-3.5 px-1.5 ${i < data.data.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <span className="text-xs text-gray-500">{log.model}</span><br />
                      <span className="text-xs text-gray-300">ID: {log.model_id}</span>
                    </td>
                    <td className={`py-3.5 px-1.5 ${i < data.data.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <span className={badgeClass(log.event)}>{log.event}</span>
                    </td>
                    <td className={`py-3.5 px-1.5 ${i < data.data.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <span className="text-xs text-gray-500">{log.created_at}</span><br />
                      <span className="text-xs text-gray-400">
                        {log.user?.nama ?? "Sistem"}{log.ip_address ? ` · ${log.ip_address}` : ""}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        lastPage={data?.last_page ?? 1}
        total={data?.total ?? 0}
        perPage={perPage}
        onPageChange={setPage}
      />
    </div>
  );
}
