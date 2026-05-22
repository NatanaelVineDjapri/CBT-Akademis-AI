"use client";

import { use } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft, CalendarDays } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import { getMonitoringList, getMonitoringDetail, getMonitoringPesertaDetail } from "@/services/MonitoringServices";
import { toSlug } from "@/utils/slug";
import MonitoringPesertaSkeleton from "@/components/skeleton/MonitoringPesertaSkeleton";

const VIOLATION_LABEL: Record<string, string> = {
  tab:            "Tab",
  fullscreen:     "Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "No Face",
  multiple_faces: "Multi Face",
  looking_away:   "Tengok",
};

const VIOLATION_LABEL_FULL: Record<string, string> = {
  tab:            "Pindah Tab",
  fullscreen:     "Keluar Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "Wajah Tidak Terdeteksi",
  multiple_faces: "Banyak Wajah",
  looking_away:   "Menengok",
};

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  sedang_berlangsung: { label: "Berlangsung", bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  selesai:            { label: "Selesai",     bg: "var(--color-primary-light)", color: "var(--color-primary)" },
  belum_mulai:        { label: "Belum Mulai", bg: "var(--akademik-tahun-bg)",   color: "var(--akademik-tahun-icon)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function MonitoringPesertaPage({ params }: { params: Promise<{ ujianId: string; userId: string }> }) {
  const { ujianId: ujianSlug, userId: pesertaSlug } = use(params);
  const router = useRouter();

  const { data: listData } = useSWR("/ujian/dosen/monitoring", getMonitoringList);
  const ujianMeta = listData?.data?.find(u => toSlug(u.nama_ujian) === ujianSlug);
  const ujianId   = ujianMeta?.id ?? null;

  const { data: detailData } = useSWR(
    ujianId ? `/ujian/dosen/monitoring/${ujianId}` : null,
    () => getMonitoringDetail(ujianId!),
  );
  const pesertaMeta = detailData?.peserta?.find(p => toSlug(p.nama ?? "") === pesertaSlug);
  const userId      = pesertaMeta?.user_id ?? null;

  const { data } = useSWR(
    ujianId && userId ? `/ujian/dosen/monitoring/${ujianId}/peserta/${userId}` : null,
    () => getMonitoringPesertaDetail(ujianId!, userId!),
    { refreshInterval: 30000, revalidateOnFocus: true },
  );

  const peserta   = data?.peserta;
  const attempts  = data?.attempts ?? [];
  const summary   = data?.violation_summary ?? {};
  const totalSoal = data?.ujian.total_soal ?? 0;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb
        overrides={{
          [ujianSlug]:   ujianMeta?.nama_ujian ?? data?.ujian.nama_ujian ?? ujianSlug,
          [pesertaSlug]: peserta?.nama ?? pesertaSlug,
        }}
      />

      {!data && <MonitoringPesertaSkeleton />}

      {data && <>
      {/* Card 1: Riwayat Attempt */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate" style={{ color: "var(--color-primary)" }}>
              {peserta?.nama ?? "Loading..."}
            </h1>
            <p className="text-xs text-gray-400">{peserta?.nim ?? ""}</p>
          </div>
        </div>
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-semibold text-gray-700">Riwayat Attempt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium w-12">#</th>
                <th className="text-center px-4 py-3 font-medium w-24">Status</th>
                <th className="text-left px-4 py-3 font-medium w-36">Waktu</th>
                <th className="text-center px-4 py-3 font-medium w-20">Progress</th>
                {Object.keys(summary).map(type => (
                  <th key={type} className="text-center px-3 py-3 font-medium w-20">
                    {VIOLATION_LABEL[type] ?? type}
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-medium w-20">Total</th>
                <th className="text-center px-4 py-3 font-medium w-24">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attempts.length === 0 ? (
                <tr><td colSpan={4 + Object.keys(summary).length + 2} className="text-center py-8 text-sm text-gray-400">Belum ada data</td></tr>
              ) : attempts.map(a => (
                <tr key={a.attempt_ke} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">{String(a.attempt_ke).padStart(2, "0")}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays size={11} className="text-gray-400 shrink-0" />
                      <span>{a.mulai_at ?? "-"}</span>
                    </div>
                    {a.selesai_at && (
                      <div className="text-xs text-gray-400 mt-0.5 pl-3.5">s/d {a.selesai_at}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600">{a.soal_dijawab}/{totalSoal}</td>
                  {Object.keys(summary).map(type => {
                    const count = a.violation_breakdown?.[type] ?? 0;
                    return (
                      <td key={type} className="px-3 py-3 text-center">
                        {count > 0 ? (
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{count}x</span>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    {a.violations > 0 ? (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{a.violations}x</span>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{a.risk_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Total Pelanggaran per Jenis */}
      {Object.keys(summary).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Total Pelanggaran per Jenis</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium">Jenis Pelanggaran</th>
                <th className="text-center px-5 py-3 font-medium w-32">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Object.entries(summary).map(([type, count]) => (
                <tr key={type} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-700">{VIOLATION_LABEL_FULL[type] ?? type}</td>
                  <td className="px-5 py-3 text-center w-32">
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{count}x</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </>}
    </div>
  );
}
