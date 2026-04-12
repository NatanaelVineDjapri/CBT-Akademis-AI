"use client";

import useSWR from "swr";
import { getMahasiswaDashboard } from "@/services/DashboardServices";
import StatCard from "@/components/dashboard/mahasiswa/StatCard";
import UjianSegeraCard from "@/components/dashboard/mahasiswa/UjianSegeraCard";
import UjianAkanDatangCard from "@/components/dashboard/mahasiswa/UjianAkanDatang";
import NilaiTerbaruCard from "@/components/dashboard/mahasiswa/NilaiTerbaruCard";
import PengumumanCard from "@/components/dashboard/PengumumanCard";
import PerkembanganNilaiChart from "@/components/dashboard/mahasiswa/PerkembanganNilaiChart";
import UjianPerBulanChart from "@/components/dashboard/mahasiswa/UjianPerBulanChart";

export default function BerandaMahasiswaPage() {
  const { data } = useSWR("/dashboard/mahasiswa", getMahasiswaDashboard, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const stats = data?.stats;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          Beranda
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang kembali! Lihat ringkasan aktivitas Anda.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Ujian Selesai"
          value={stats ? String(stats.ujian_selesai) : "-"}
          color="green"
          icon="check"
        />
        <StatCard
          label="Ujian Akan Datang"
          value={stats ? String(stats.ujian_akan_datang) : "-"}
          color="blue"
          icon="clock"
        />
        <StatCard
          label="Rata-rata Nilai"
          value={stats ? String(stats.rata_rata_nilai) : "-"}
          color="pink"
          icon="chart"
        />
        <StatCard
          label="Nilai Tertinggi"
          value={stats ? String(stats.nilai_tertinggi) : "-"}
          color="amber"
          icon="trophy"
        />
      </div>
      <PengumumanCard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col gap-4">
          <UjianSegeraCard data={data?.ujian_segera ?? null} />
          <UjianAkanDatangCard data={data?.ujian_akan_datang ?? []} />
          <UjianPerBulanChart data={data?.ujian_per_bulan ?? []} />
        </div>
        <div className="flex flex-col gap-4">
          <NilaiTerbaruCard data={data?.nilai_terbaru ?? []} />
          <PerkembanganNilaiChart data={data?.perkembangan_nilai ?? []} />
        </div>
      </div>
    </div>
  );
}
