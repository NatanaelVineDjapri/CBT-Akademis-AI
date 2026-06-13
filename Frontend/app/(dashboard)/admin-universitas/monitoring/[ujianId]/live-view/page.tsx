"use client";

import { use, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
import { getAdminMonitoringList, getAdminMonitoringDetail } from "@/services/MonitoringServices";
import { getEcho } from "@/lib/echo";
import { toSlug } from "@/utils/slug";
import LiveViewBoard from "@/components/monitoring/LiveViewBoard";

export default function AdminLiveViewPage({ params }: { params: Promise<{ ujianId: string }> }) {
  const { ujianId: slug } = use(params);
  const router = useRouter();

  const { data: listData } = useSWR("/ujian/admin-universitas/monitoring", getAdminMonitoringList);
  const ujianMeta = listData?.data?.find(u => toSlug(u.nama_ujian) === slug);
  const id = ujianMeta?.id ?? null;

  const { data, mutate } = useSWR(
    id ? `/ujian/admin-universitas/monitoring/${id}` : null,
    () => getAdminMonitoringDetail(id!),
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

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb
        overrides={{
          [slug]:      ujianMeta?.nama_ujian ?? slug,
          "live-view": "Live View",
        }}
      />
      <LiveViewBoard
        namaUjian={data?.ujian?.nama_ujian ?? ujianMeta?.nama_ujian}
        peserta={data?.peserta ?? []}
        onBack={() => router.back()}
      />
    </div>
  );
}
