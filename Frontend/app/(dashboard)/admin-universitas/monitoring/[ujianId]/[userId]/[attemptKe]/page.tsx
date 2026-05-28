"use client";

import { use } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft, ImageOff } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import { getAdminMonitoringList, getAdminMonitoringDetail, getAdminMonitoringPesertaDetail } from "@/services/MonitoringServices";
import { toSlug } from "@/utils/slug";
import { formatDateTime } from "@/utils/format";

const VIOLATION_LABEL: Record<string, string> = {
  tab:            "Pindah Tab",
  fullscreen:     "Keluar Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "Wajah Tidak Terdeteksi",
  multiple_faces: "Banyak Wajah",
  looking_away:   "Menengok",
};

const VIOLATION_COLOR: Record<string, string> = {
  tab:            "#f97316",
  fullscreen:     "#8b5cf6",
  copypaste:      "#ec4899",
  no_face:        "#ef4444",
  multiple_faces: "#dc2626",
  looking_away:   "#f59e0b",
};

export default function AdminBuktiPage({ params }: { params: Promise<{ ujianId: string; userId: string; attemptKe: string }> }) {
  const { ujianId: ujianSlug, userId: pesertaSlug, attemptKe: attemptKeParam } = use(params);
  const router    = useRouter();
  const attemptKe = Number(attemptKeParam);

  const { data: listData } = useSWR("/ujian/admin-universitas/monitoring", getAdminMonitoringList);
  const ujianMeta = listData?.data?.find(u => toSlug(u.nama_ujian) === ujianSlug);
  const ujianId   = ujianMeta?.id ?? null;

  const { data: detailData } = useSWR(
    ujianId ? `/ujian/admin-universitas/monitoring/${ujianId}` : null,
    () => getAdminMonitoringDetail(ujianId!),
  );
  const pesertaMeta = detailData?.peserta?.find(p => toSlug(p.nama ?? "") === pesertaSlug);
  const userId      = pesertaMeta?.user_id ?? null;

  const { data } = useSWR(
    ujianId && userId ? `/ujian/admin-universitas/monitoring/${ujianId}/peserta/${userId}` : null,
    () => getAdminMonitoringPesertaDetail(ujianId!, userId!),
  );

  const attempt = data?.attempts?.find(a => a.attempt_ke === attemptKe);
  const fotos   = attempt?.foto_bukti ?? [];
  const peserta = data?.peserta;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb
        overrides={{
          [ujianSlug]:      ujianMeta?.nama_ujian ?? data?.ujian.nama_ujian ?? ujianSlug,
          [pesertaSlug]:    peserta?.nama ?? pesertaSlug,
          [attemptKeParam]: `Bukti Attempt ${attemptKe}`,
        }}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate" style={{ color: "var(--color-primary)" }}>
              Bukti Pelanggaran Attempt {String(attemptKe).padStart(2, "0")}
            </h1>
            <p className="text-xs text-gray-400">{peserta?.nama ?? ""}</p>
          </div>
          {fotos.length > 0 && (
            <span className="text-xs text-gray-400">{fotos.length} foto</span>
          )}
        </div>

        <div className="p-5">
          {!data && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gray-100 animate-pulse" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded mt-2 w-3/4" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded mt-1 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {data && fotos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <ImageOff size={36} strokeWidth={1.5} />
              <span className="text-sm">Tidak ada foto bukti untuk attempt ini</span>
            </div>
          )}

          {data && fotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fotos.map((f, i) => {
                const color = VIOLATION_COLOR[f.tipe] ?? "#6b7280";
                return (
                  <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--color-primary)" }}>
                    <div className="aspect-video relative">
                      <img
                        src={f.url}
                        alt={`Bukti ${i + 1}`}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <span
                        className="absolute top-3.5 left-3.5 text-[9px] font-semibold text-white px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: color }}
                      >
                        {VIOLATION_LABEL[f.tipe] ?? f.tipe}
                      </span>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between gap-1">
                      <span className="text-[10px] text-white/70 truncate">{formatDateTime(f.waktu)}</span>
                      <span className="text-[10px] font-bold text-white shrink-0">+{f.risk_score}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
