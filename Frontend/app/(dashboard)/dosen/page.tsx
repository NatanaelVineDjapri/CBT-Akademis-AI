"use client";

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

export default function DashboardPage() {
  const userName = "Nama";

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">Hello</p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back {userName}!
        </h1>
      </div>

      {/* Baris 1: Kiri (Bank Soal + Ujian Terbaru) | Kanan (Berlangsung + Selesai) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-stretch">
        
        {/* Kolom Kiri */}
        <div className="flex flex-col gap-4">
          <BankSoalCard />
          <UjianTerbaruCard />
        </div>

        {/* Kolom Kanan */}
        <div className="flex flex-col gap-4">
          <UjianBerlangsungCard />
          <UjianSelesaiCard />
        </div>

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