"use client";

import { use, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft, Video } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import { getMonitoringList, getMonitoringDetail } from "@/services/MonitoringServices";
import { getEcho } from "@/lib/echo";
import { toSlug } from "@/utils/slug";
import LiveVideoTile from "@/components/dashboard/dosen/monitoring/LiveVideoTile";

export default function LiveViewPage({ params }: { params: Promise<{ ujianId: string }> }) {
  const { ujianId: slug } = use(params);
  const router = useRouter();

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
    const ch = echo.channel(`ujian.${id}`);
    ch.listen(".jawaban-masuk", () => mutate());
    return () => { echo.leaveChannel(`ujian.${id}`); };
  }, [id, mutate]);

  const ujian = data?.ujian;
  const aktif = (data?.peserta ?? []).filter(p => p.status === "sedang_berlangsung");

  const cols =
    aktif.length <= 1 ? 1 :
    aktif.length <= 4 ? 2 :
    aktif.length <= 9 ? 3 : 4;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb
        overrides={{
          [slug]:        ujianMeta?.nama_ujian ?? slug,
          "live-view":   "Live View",
        }}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate" style={{ color: "var(--color-primary)" }}>
              Live View
            </h1>
            <p className="text-xs text-gray-400">{ujian?.nama_ujian ?? ujianMeta?.nama_ujian ?? "Loading..."}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: "var(--color-warning)" }}>
              {aktif.length} aktif
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="p-4 bg-gray-950 rounded-b-2xl">
          {aktif.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                <Video size={24} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-500">Tidak ada peserta aktif saat ini.</p>
            </div>
          ) : (
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {aktif.map(p => (
                <LiveVideoTile
                  key={p.peserta_ujian_id}
                  pesertaUjianId={p.peserta_ujian_id}
                  nama={p.nama}
                  nim={p.nim}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
