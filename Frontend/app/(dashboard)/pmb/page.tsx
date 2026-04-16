"use client";

import useSWR from "swr";
import { useUser } from "../../../context/UserContext";
import { getMahasiswaDashboard } from "@/services/DashboardServices";
import BerandaSkeleton from "@/components/skeleton/BerandaSkeleton";
import PengumumanPMBCard from "@/components/dashboard/pmb/PengumumanPMBCard";
import UjianSegeraPMBCard from "@/components/dashboard/pmb/UjianSegeraPMBCard";
import SemangatCard from "@/components/dashboard/mahasiswa/SemangatCard";

export default function BerandaPMBPage() {
  const { user } = useUser();
  const { data } = useSWR("/dashboard/mahasiswa", getMahasiswaDashboard, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Beranda
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang, {user?.nama ?? "Peserta"}!
        </p>
      </div>

      {!data ? (
        <BerandaSkeleton />
      ) : (
        <>
          <PengumumanPMBCard />
          <UjianSegeraPMBCard data={data.ujian_segera} />
          <SemangatCard />
        </>
      )}
    </div>
  );
}
