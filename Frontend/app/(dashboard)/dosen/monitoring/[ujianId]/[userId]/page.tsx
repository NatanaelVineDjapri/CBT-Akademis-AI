"use client";

import { use } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import { getMonitoringList, getMonitoringDetail, getMonitoringPesertaDetail } from "@/services/MonitoringServices";
import { toSlug } from "@/utils/slug";

const VIOLATION_LABEL: Record<string, string> = {
  tab:            "Pindah Tab",
  fullscreen:     "Keluar Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "Wajah Tidak Terdeteksi",
  multiple_faces: "Banyak Wajah",
  looking_away:   "Menengok",
};

function StatusBadge({ status }: { status: string }) {
  if (status === "sedang_berlangsung")
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Aktif</span>;
  if (status === "selesai")
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Selesai</span>;
  return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Belum Mulai</span>;
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

  // Step 3: fetch peserta detail
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate" style={{ color: "var(--color-primary)" }}>
              {peserta?.nama ?? "Loading..."}
            </h1>
            <p className="text-xs text-gray-400">{peserta?.nim ?? ""}</p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">

          {/* Tabel attempt */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">Riwayat Attempt</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-medium">Attempt</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                    <th className="text-center px-4 py-3 font-medium">Mulai</th>
                    <th className="text-center px-4 py-3 font-medium">Selesai</th>
                    <th className="text-center px-4 py-3 font-medium">Progress</th>
                    <th className="text-center px-4 py-3 font-medium">Pelanggaran</th>
                    <th className="text-center px-4 py-3 font-medium">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attempts.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-sm text-gray-400">Belum ada data</td></tr>
                  ) : attempts.map(a => (
                    <tr key={a.attempt_ke} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-gray-700">#{a.attempt_ke}</td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">{a.mulai_at ?? "-"}</td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">{a.selesai_at ?? "-"}</td>
                      <td className="px-4 py-3 text-center text-xs text-gray-600">{a.soal_dijawab}/{totalSoal}</td>
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

          {/* Ringkasan pelanggaran per jenis */}
          {Object.keys(summary).length > 0 && (
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-sm font-semibold text-gray-700">Total Pelanggaran per Jenis</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-medium">Jenis Pelanggaran</th>
                    <th className="text-center px-5 py-3 font-medium">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Object.entries(summary).map(([type, count]) => (
                    <tr key={type} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-700">{VIOLATION_LABEL[type] ?? type}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{count}x</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
