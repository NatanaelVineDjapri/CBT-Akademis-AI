"use client";

import useSWR from "swr";
import { useUser } from "../../../context/UserContext";
import { getDosenDashboard } from "@/services/DashboardServices";
import BankSoalCard from "@/components/dashboard/dosen/BankSoalCard";
import UjianTerbaruCard from "@/components/dashboard/dosen/UjianTerbaruCard";
import UjianBerlangsungCard from "@/components/dashboard/dosen/UjianBerlangsungCard";
import UjianSelesaiCard from "@/components/dashboard/dosen/UjianSelesaiCard";
import PerformaChart from "@/components/dashboard/dosen/PerformaChart";
import PersentaseKelulusanCard from "@/components/dashboard/dosen/PersentaseKelulusanCard";
import RataRataNilaiCard from "@/components/dashboard/dosen/RataRataNilaiCard";
import GrafikPelanggaranCard from "@/components/dashboard/dosen/GrafikPelanggaranCard";
import TotalPelanggaranCard from "@/components/dashboard/dosen/TotalPelanggaranCard";
import JadwalCard from "@/components/dashboard/dosen/JadwalCard";
import PengumumanCard from "@/components/dashboard/PengumumanCard";

export default function DashboardDosenPage() {
  const { user } = useUser();
  const { data } = useSWR("/dashboard/dosen", getDosenDashboard, { revalidateOnFocus: false });

  return (
    <div className="min-h-screen p-3">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-2xl font-semibold" style={{color: "var(--color-primary)"}}>Hello</p>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>Welcome Back {user?.nama ?? "Dosen"}</h1>
      </div>

      {/* Baris 1: Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <BankSoalCard data={data?.bank_soal ?? []} />
        <UjianBerlangsungCard data={data?.ujian_berlangsung ?? []} />
        <UjianTerbaruCard data={data?.ujian_terbaru ?? []} />
        <UjianSelesaiCard data={data?.ujian_selesai ?? []} />
      </div>

      {/* Baris 2: Performa Chart */}
      <div className="mb-4">
        <PerformaChart />
      </div>

      {/* Baris 3: Persentase Kelulusan + Rata-rata Nilai */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <PersentaseKelulusanCard />
        <RataRataNilaiCard />
      </div>

      {/* Baris 4: Grafik Pelanggaran + Total Pelanggaran */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GrafikPelanggaranCard />
        <TotalPelanggaranCard />
      </div>

      {/* Baris 5: Jadwal + Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <JadwalCard />
        <PengumumanCard />
      </div>
    </div>
  );
}
