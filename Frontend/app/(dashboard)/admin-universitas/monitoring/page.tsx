"use client";

import useSWR, { preload } from "swr";
import Link from "next/link";
import { ShieldCheck, Clock, Users, AlertTriangle, Timer } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import EmptyState from "@/components/EmptyState";
import { getAdminMonitoringList, getAdminMonitoringDetail, type MonitoringUjian } from "@/services/MonitoringServices";
import { toSlug } from "@/utils/slug";

function fmt(s: string | null) {
  if (!s) return "-";
  const d = new Date(s);
  return d.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function UjianMonitorCard({ ujian }: { ujian: MonitoringUjian }) {
  return (
    <div className="rounded-2xl shadow-md overflow-hidden flex flex-col" style={{ background: "var(--color-primary)" }}>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white">
            <ShieldCheck className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-bold text-white leading-snug truncate">{ujian.nama_ujian}</p>
            <p className="text-xs text-white/60 truncate">{ujian.mata_kuliah ?? "—"}</p>
          </div>
        </div>

        <div className="border-t border-white/20" />

        <div className="flex items-center gap-3 text-xs text-white/70">
          <div className="flex items-center gap-1">
            <Clock size={11} className="shrink-0" />
            <span>{fmt(ujian.start_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer size={11} className="shrink-0" />
            <span>{ujian.durasi_menit} menit</span>
          </div>
        </div>

        <div className="border-t border-white/20" />

        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-1">
            <Users size={11} className="shrink-0" />
            <span>{ujian.peserta_aktif}/{ujian.total_peserta} aktif</span>
          </div>
          {ujian.total_violations > 0 ? (
            <div className="flex items-center gap-1 text-red-500 bg-white px-2 py-1 rounded-full">
              <AlertTriangle size={11} className="shrink-0" />
              <span className="font-medium">{ujian.total_violations} pelanggaran</span>
            </div>
          ) : (
            <span className="text-white/30">Tidak ada pelanggaran</span>
          )}
        </div>

        <div className="border-t border-white/20" />

        <Link
          href={`/admin-universitas/monitoring/${toSlug(ujian.nama_ujian)}`}
          className="w-full py-2 rounded-lg text-xs font-medium text-center block bg-white hover:bg-white/90 transition-colors"
          style={{ color: "var(--color-primary)" }}
          onMouseEnter={() => preload(`/ujian/admin-universitas/monitoring/${ujian.id}`, () => getAdminMonitoringDetail(ujian.id))}
        >
          Pantau
        </Link>
      </div>
    </div>
  );
}

export default function AdminMonitoringPage() {
  const { data, isLoading } = useSWR("/ujian/admin-universitas/monitoring", getAdminMonitoringList, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  });

  const ujianList = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Monitoring</h2>
          <p className="text-xs text-gray-400 mt-0.5">Ujian yang sedang berlangsung.</p>
        </div>
        <div className="p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-1 bg-gray-200" />
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-gray-100 rounded mb-1" />
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="h-3 w-40 bg-gray-100 rounded" />
                    <div className="h-px bg-gray-100" />
                    <div className="h-3 w-36 bg-gray-100 rounded" />
                    <div className="h-px bg-gray-100" />
                    <div className="h-8 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : ujianList.length === 0 ? (
            <EmptyState message="Tidak ada ujian yang sedang berlangsung." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ujianList.map(u => <UjianMonitorCard key={u.id} ujian={u} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
