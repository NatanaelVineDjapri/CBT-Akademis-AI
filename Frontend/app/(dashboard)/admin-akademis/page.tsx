"use client";

import useSWR from "swr";
import { useUser } from "../../../context/UserContext";
import { getAdminAkademisDashboard } from "@/services/DashboardServices";
import { Building2, Users, ClipboardList, BookOpen } from "lucide-react";
import StatCard from "@/components/dashboard/admin-universitas/StatCard";
import DashboardSkeleton from "@/components/dashboard/admin-akademis/DashboardSkeleton";
import DistribusiPengguna from "@/components/dashboard/admin-akademis/DistribusiPengguna";
import AktivitasUjian from "@/components/dashboard/admin-akademis/AktivitasUjian";
import TingkatKelulusan from "@/components/dashboard/admin-akademis/TingkatKelulusan";
import TrenNilai from "@/components/dashboard/admin-akademis/TrenNilai";

export default function AdminAkademisPage() {
  const { user } = useUser();
  const { data } = useSWR("/dashboard/admin-akademis", getAdminAkademisDashboard, { revalidateOnFocus: false });

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Welcome Back, {user?.nama ?? "Admin"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Dashboard Admin Akademis AI</p>
      </div>

      {!data ? <DashboardSkeleton /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Universitas" value={data.stats.total_universitas} icon={Building2}    color="#097797" />
          <StatCard label="Total Pengguna"    value={data.stats.total_pengguna}    icon={Users}        color="#22c55e" />
          <StatCard label="Total Ujian"       value={data.stats.total_ujian}       icon={ClipboardList} color="#a855f7" />
          <StatCard label="Total Bank Soal"   value={data.stats.total_bank_soal}   icon={BookOpen}     color="#f59e0b" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DistribusiPengguna />
        <AktivitasUjian />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TingkatKelulusan />
        <TrenNilai />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MaintenanceCard />
        <PengumumanCard />
      </div>
    </div>
  );
}

function MaintenanceCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Maintenance Break</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Mengaktifkan mode Maintenance Break akan menonaktifkan sementara seluruh akses dan fitur sistem bagi pengguna.
      </p>
      <button
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Maintenance: OFF
      </button>
    </div>
  );
}

function PengumumanCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Pengumuman</span>
      </div>
      <textarea
        placeholder="Tulis pengumuman platform..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 mb-3 resize-none outline-none focus:border-[var(--color-primary)] transition-colors"
        rows={3}
      />
      <button
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Unggah
      </button>
    </div>
  );
}
