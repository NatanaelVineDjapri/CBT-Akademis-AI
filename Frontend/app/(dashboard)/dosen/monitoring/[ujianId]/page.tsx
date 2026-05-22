"use client";

import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, AlertTriangle, Clock } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import { getMonitoringList, getMonitoringDetail } from "@/services/MonitoringServices";
import { getEcho } from "@/lib/echo";
import { toSlug } from "@/utils/slug";
import { useDebounce } from "@/hooks/useDebounce";

const PER_PAGE = 20;

function StatusBadge({ status }: { status: string }) {
  if (status === "sedang_berlangsung")
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Aktif</span>;
  if (status === "selesai")
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Selesai</span>;
  return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Belum Mulai</span>;
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
  const debouncedSearch             = useDebounce(search);

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

  const ujian   = data?.ujian;
  const peserta = data?.peserta ?? [];

  const aktif           = peserta.filter(p => p.status === "sedang_berlangsung").length;
  const totalViolations = peserta.reduce((s, p) => s + p.violations, 0);

  const q = debouncedSearch.toLowerCase();
  const filtered = peserta.filter(p =>
    (p.nama ?? "").toLowerCase().includes(q) ||
    (p.nim  ?? "").toLowerCase().includes(q)
  );
  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged    = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
            <SearchInput value={search} onChange={v => setSearch(v)} placeholder="Cari nama / NIM..." />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium w-12">#</th>
                <th className="text-left px-5 py-3 font-medium">Nama</th>
                <th className="text-left px-5 py-3 font-medium">NIM</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Progress</th>
                <th className="text-center px-4 py-3 font-medium">Pelanggaran</th>
                <th className="px-5 py-3 font-medium">Risk Score</th>
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
                    <Link href={`/dosen/monitoring/${slug}/${toSlug(p.nama ?? String(p.user_id))}`} className="hover:underline" style={{ color: "var(--color-primary)" }}>
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
        total={filtered.length}
        perPage={PER_PAGE}
        onPageChange={setPage}
      />
    </div>
  );
}
