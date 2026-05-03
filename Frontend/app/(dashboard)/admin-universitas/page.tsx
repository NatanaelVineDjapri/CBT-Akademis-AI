'use client'

import useSWR from "swr";
import { useUser } from "../../../context/UserContext";
import { getAdminUniversitasDashboard } from "@/services/DashboardServices";
import { Users, GraduationCap, LayoutGrid, FileText } from "lucide-react";
import StatCard from "@/components/dashboard/admin-universitas/StatCard";
import UjianBerlangsungCard from "@/components/dashboard/admin-universitas/UjianBerlangsungCard";
import BankSoalCard from "@/components/dashboard/admin-universitas/BankSoalCard";
import UjianTerbaruCard from "@/components/dashboard/admin-universitas/UjianTerbaruCard";
import PengumumanCard from "@/components/dashboard/admin-universitas/PengumumanCard";
import DashboardSkeleton from "@/components/dashboard/admin-universitas/DashboardSkeleton";
import StatistikPMBChart from "@/components/dashboard/admin-universitas/StatistikPMBChart";
import GrafikPenerimaan from "@/components/dashboard/admin-universitas/GrafikPenerimaan";
import DistribusiMahasiswa from "@/components/dashboard/admin-universitas/DistribusiMahasiswa";
import PerformaProdi from "@/components/dashboard/admin-universitas/PerformaProdi";
import AktivitasUjian from "@/components/dashboard/admin-universitas/AktivitasUjian";
import TingkatKelulusan from "@/components/dashboard/admin-universitas/TingkatKelulusan";
import TrenNilai from "@/components/dashboard/admin-universitas/TrenNilai";

export default function AdminUniversitasDashboardPage() {
  const { user } = useUser();
  const { data } = useSWR("/dashboard/admin-universitas", getAdminUniversitasDashboard, { revalidateOnFocus: false });

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Welcome Back, {user?.nama ?? "Admin"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {user?.universitas_nama ?? "Dashboard Admin Universitas"}
        </p>
      </div>

      {!data ? <DashboardSkeleton /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Dosen"     value={data.stats.total_dosen}      icon={Users}        color="#097797" />
            <StatCard label="Total Mahasiswa" value={data.stats.total_mahasiswa}  icon={GraduationCap} color="#22c55e" />
            <StatCard label="Mata Kuliah"     value={data.stats.total_matakuliah} icon={LayoutGrid}   color="#a855f7" />
            <StatCard label="Total Ujian"     value={data.stats.total_ujian}      icon={FileText}     color="#f59e0b" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UjianBerlangsungCard data={data.ujian_berlangsung} />
            <BankSoalCard data={data.bank_soal} />
          </div>
        </>
      )}

      <StatistikPMBChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GrafikPenerimaan />
        <DistribusiMahasiswa />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformaProdi />
        <AktivitasUjian />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TingkatKelulusan />
        <TrenNilai />
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UjianTerbaruCard data={data.ujian_terbaru} />
          <PengumumanCard data={data.pengumuman} />
        </div>
      )}
    </div>
  );
}
