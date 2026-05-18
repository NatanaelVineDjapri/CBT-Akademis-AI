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
          {data.jawaban.essay.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h2 className="text-base font-semibold mb-4" style={{ color: "var(--color-primary)" }}>Jawaban Essay</h2>
              <div className="space-y-4">
                {data.jawaban.essay.map((row, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium">Soal {String(row.no).padStart(2, "0")}</span>
                      <span className="text-xs border border-gray-200 rounded-lg px-2 py-0.5 text-gray-600">Poin: {row.poin ?? "-"}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{row.soal}</p>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 whitespace-pre-wrap">{row.jawaban || <span className="text-gray-400 italic">Tidak dijawab</span>}</div>
                    {row.ai_feedback && (
                      <div className="mt-2 bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-600">{row.ai_feedback}</div>
                    )}
                    {row.dosen_feedback && (
                      <div className="mt-2 bg-green-50 rounded-lg px-3 py-2 text-xs text-green-700">Feedback dosen: {row.dosen_feedback}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.jawaban.pilihan_ganda.length === 0 && data.jawaban.checklist.length === 0 && data.jawaban.essay.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-400">
              Tidak ada detail jawaban tersedia.
            </div>
          )}
        </div>
      )}
    </div>
  );
}