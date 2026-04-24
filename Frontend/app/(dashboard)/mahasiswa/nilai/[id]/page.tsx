"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { getNilaiDetail } from "@/services/NilaiServices";
import BadgeNilai from "@/components/dashboard/mahasiswa/BadgeNilai";
import JawabanPilihanGanda from "@/components/dashboard/mahasiswa/JawabanPilihanGanda";
import JawabanCheckBox from "@/components/dashboard/mahasiswa/JawabanCheckbox";
import NilaiDetailSkeleton from "@/components/skeleton/NilaiDetailSkeleton";

export default function NilaiDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useSWR(
    id ? `/nilai/${id}` : null,
    () => getNilaiDetail(id),
    { revalidateOnFocus: false }
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[var(--color-primary)]">Detail Nilai</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat detail jawaban dan hasil ujian kamu</p>
      </div>

      {isLoading ? <NilaiDetailSkeleton /> : !data ? null : (
        <div className="space-y-4">
          <BadgeNilai info={data.info} />
          {data.jawaban.pilihan_ganda.length > 0 && (
            <JawabanPilihanGanda data={data.jawaban.pilihan_ganda} />
          )}
          {data.jawaban.checklist.length > 0 && (
            <JawabanCheckBox data={data.jawaban.checklist} />
          )}
        </div>
      )}
    </div>
  );
}