"use client";

import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, AlertTriangle, Clock, MonitorPlay, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import { getMonitoringList, getMonitoringDetail } from "@/services/MonitoringServices";
import { getEcho } from "@/lib/echo";
import { toSlug } from "@/utils/slug";
import { useMonitoringConnection } from "@/contexts/MonitoringConnectionContext";
import { useDebounce } from "@/hooks/useDebounce";

const PER_PAGE = 20;

type SortBy = "nama" | "nim" | "violations" | "risk_score";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort, center }: {
  label: string; col: SortBy; sortBy: SortBy; sortDir: SortDir; onSort: (col: SortBy) => void; center?: boolean;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap ${center ? "text-center" : "text-left px-5"}`} onClick={() => onSort(col)}>
      <span className={`flex items-center gap-1 ${center ? "justify-center" : ""}`}>
        {label}
        <Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} />
      </span>
    </th>
  );
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  sedang_berlangsung: { label: "Aktif",       bg: "var(--color-warning-light)",  color: "var(--color-warning)"  },
  selesai:            { label: "Selesai",     bg: "var(--color-primary-light)",  color: "var(--color-primary)"  },
  belum_mulai:        { label: "Belum Mulai", bg: "var(--akademik-tahun-bg)",    color: "var(--akademik-tahun-icon)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.belum_mulai;
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function RiskBar({ score }: { score: number }) {
  const pct = Math.min(100, (score / 100) * 100);
  const color = score >= 50 ? "bg-red-500" : score >= 20 ? "bg-yellow-400" : "bg-green-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{score}</span>
    </div>
  );
}

export default function MonitoringDetailPage({ params }: { params: Promise<{ ujianId: string }> }) {
  const { ujianId: slug } = use(params);
  const router = useRouter();

  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [sortBy, setSortBy]         = useState<SortBy>("risk_score");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const debouncedSearch             = useDebounce(search);

  const handleSort = (col: SortBy) => {
    const newDir: SortDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : (col === "violations" || col === "risk_score" ? "desc" : "asc");
    setSortBy(col);
    setSortDir(newDir);
    setPage(1);
  };

  const { data: listData } = useSWR("/ujian/dosen/monitoring", getMonitoringList);
  const ujianMeta = listData?.data?.find(u => toSlug(u.nama_ujian) === slug);
  const id = ujianMeta?.id ?? null;

  const { data, mutate } = useSWR(
    id ? `/ujian/dosen/monitoring/${id}` : null,
    () => getMonitoringDetail(id!),
    { refreshInterval: 30000, revalidateOnFocus: true },
  );

  useEffect(() => {
    if (!id) return;
    const echo = getEcho();
    if (!echo) return;
    const channel = echo.channel(`ujian.${id}`);
    channel.listen(".pelanggaran-masuk", () => mutate());
    channel.listen(".jawaban-masuk", () => mutate());
    return () => { echo.leaveChannel(`ujian.${id}`); };
  }, [id, mutate]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const { preConnect } = useMonitoringConnection();

  useEffect(() => {
    if (!data) return;
    data.peserta
      .filter(p => p.status === "sedang_berlangsung")
      .forEach(p => preConnect(p.peserta_ujian_id));
  }, [data, preConnect]);

  const ujian   = data?.ujian;
  const peserta = data?.peserta ?? [];

  const aktif           = peserta.filter(p => p.status === "sedang_berlangsung").length;
  const totalViolations = peserta.reduce((s, p) => s + p.violations, 0);

  const q = debouncedSearch.toLowerCase();
  const filtered = peserta.filter(p =>
    (p.nama ?? "").toLowerCase().includes(q) ||
    (p.nim  ?? "").toLowerCase().includes(q)
  );
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "nama") cmp = (a.nama ?? "").localeCompare(b.nama ?? "", "id");
    else if (sortBy === "nim") cmp = (a.nim ?? "").localeCompare(b.nim ?? "", "id");
    else if (sortBy === "violations") cmp = a.violations - b.violations;
    else cmp = a.risk_score - b.risk_score;
    return sortDir === "asc" ? cmp : -cmp;
  });
  const lastPage = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paged    = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb overrides={{ [slug]: ujianMeta?.nama_ujian ?? slug }} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate" style={{ color: "var(--color-primary)" }}>
              {ujian?.nama_ujian ?? ujianMeta?.nama_ujian ?? "Loading..."}
            </h1>
            {(ujian?.mata_kuliah ?? ujianMeta?.mata_kuliah) && (
              <p className="text-xs text-gray-400">{ujian?.mata_kuliah ?? ujianMeta?.mata_kuliah}</p>
            )}
          </div>
        </div>

        {/* Stats + Search row */}
        {(ujian || ujianMeta) && (
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-blue-400 shrink-0" />
              <span className="text-xs text-gray-400">Peserta aktif</span>
              <span className="text-xs font-bold text-blue-600">{aktif}/{peserta.length}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 shrink-0" />
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-red-400 shrink-0" />
              <span className="text-xs text-gray-400">Pelanggaran</span>
              <span className={`text-xs font-bold ${totalViolations > 0 ? "text-red-500" : "text-gray-400"}`}>
                {totalViolations}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-200 shrink-0" />
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-400">Durasi</span>
              <span className="text-xs font-bold text-gray-600">
                {ujian?.durasi_menit ?? ujianMeta?.durasi_menit} menit
              </span>
            </div>
            <div className="flex-1" />
            {aktif > 0 && (
              <Link
                href={`/dosen/monitoring/${slug}/live-view`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <MonitorPlay size={13} />
                Live View
              </Link>
            )}
            <SearchInput value={search} onChange={v => setSearch(v)} placeholder="Cari nama / NIM..." />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium w-12">#</th>
                <ColHeader label="Nama" col="nama" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="NIM" col="nim" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Progress</th>
                <ColHeader label="Pelanggaran" col="violations" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} center />
                <ColHeader label="Risk Score" col="risk_score" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm text-gray-400">
                    {search ? "Tidak ada peserta ditemukan." : "Belum ada peserta"}
                  </td>
                </tr>
              ) : paged.map((p, idx) => (
                <tr key={p.peserta_ujian_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {String((page - 1) * PER_PAGE + idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">
                    <Link href={`/dosen/monitoring/${slug}/${toSlug(p.nama ?? String(p.user_id))}?pid=${p.peserta_ujian_id}&uid=${p.user_id}&eid=${id}`} className="hover:underline" style={{ color: "var(--color-primary)" }}>
                      {p.nama ?? "-"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.nim ?? "-"}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-gray-600">{p.soal_dijawab}/{p.total_soal}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.violations > 0 ? (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{p.violations}x</span>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3 w-40"><RiskBar score={p.risk_score} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <Pagination
        currentPage={page}
        lastPage={lastPage}
        total={sorted.length}
        perPage={PER_PAGE}
        onPageChange={setPage}
      />
    </div>
  );
}
