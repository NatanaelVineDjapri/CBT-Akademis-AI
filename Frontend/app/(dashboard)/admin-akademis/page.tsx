"use client";

import useSWR from "swr";
import Link from "next/link";
import { useUser } from "../../../context/UserContext";
import { getAdminAkademisDashboard } from "@/services/DashboardServices";
import { getMaintenanceStatus } from "@/services/SettingsService";
import { getPengumuman, type Pengumuman } from "@/services/PengumumanService";
import { Building2, Users, ClipboardList, BookOpen, Bell, Wrench } from "lucide-react";
import StatCard from "@/components/dashboard/admin-universitas/StatCard";
import DashboardSkeleton from "@/components/dashboard/admin-akademis/DashboardSkeleton";
import DistribusiPengguna from "@/components/dashboard/admin-akademis/DistribusiPengguna";
import AktivitasUjian from "@/components/dashboard/admin-akademis/AktivitasUjian";
import TingkatKelulusan from "@/components/dashboard/admin-akademis/TingkatKelulusan";
import TrenNilai from "@/components/dashboard/admin-akademis/TrenNilai";
import PertumbuhanPengguna from "@/components/dashboard/admin-akademis/PertumbuhanPengguna";

export default function AdminAkademisPage() {
  const { user } = useUser();
  const { data } = useSWR("/dashboard/admin-akademis", getAdminAkademisDashboard, { revalidateOnFocus: false });

  if (!data) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Welcome Back, {user?.nama ?? "Admin"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Dashboard Admin Akademis AI</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Universitas" value={data.stats.total_universitas} icon={Building2}    color="#097797" />
        <StatCard label="Total Pengguna"    value={data.stats.total_pengguna}    icon={Users}        color="#22c55e" />
        <StatCard label="Total Ujian"       value={data.stats.total_ujian}       icon={ClipboardList} color="#a855f7" />
        <StatCard label="Total Bank Soal"   value={data.stats.total_bank_soal}   icon={BookOpen}     color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DistribusiPengguna />
        <AktivitasUjian />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TingkatKelulusan />
        <TrenNilai />
      </div>

      <PertumbuhanPengguna />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MaintenanceCard />
        <PengumumanCard />
      </div>
    </div>
  );
}

function MaintenanceCard() {
  const { data } = useSWR("/settings/maintenance", getMaintenanceStatus, { revalidateOnFocus: false });
  const isOn = data?.maintenance ?? false;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-800">Maintenance Break</span>
        </div>
        <Link href="/admin-akademis/maintenance" className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80"
          style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}>
          Kelola
        </Link>
      </div>
      <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, white)" }}>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOn ? "bg-red-500 animate-pulse" : ""}`} style={isOn ? {} : { backgroundColor: "var(--color-primary)" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: isOn ? "#dc2626" : "var(--color-primary)" }}>
            {isOn ? "Maintenance Aktif" : "Sistem Berjalan Normal"}
          </p>
          <p className="text-xs mt-0.5 text-gray-500">
            {isOn ? "Semua pengguna tidak dapat mengakses sistem." : "Semua pengguna dapat mengakses sistem."}
          </p>
        </div>
      </div>
    </div>
  );
}

function PengumumanCard() {
  const { data } = useSWR(["/pengumuman", "", "", "created_at", "desc", 1, 3], ([,,,sb,sd,p,pp]) => getPengumuman({ sort_by: sb, sort_dir: sd, page: p, per_page: pp }), { revalidateOnFocus: false });
  const items = data?.data ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-800">Pengumuman Aktif</span>
        </div>
        <Link href="/admin-akademis/pengumuman" className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80"
          style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}>
          Kelola
        </Link>
      </div>
      {!data ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada pengumuman aktif.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((p: Pengumuman) => (
            <div key={p.id} className="p-3 rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 6%, white)" }}>
              <p className="text-sm font-semibold text-gray-800 truncate">{p.judul}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.isi}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
