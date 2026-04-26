"use client";

import { use } from "react";
import { useState } from "react";
import useSWR from "swr";
import { User } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import NilaiDetailSkeleton from "@/components/skeleton/NilaiDetailSkeleton";
import JawabanPilihanGanda from "@/components/dashboard/mahasiswa/JawabanPilihanGanda";
import JawabanCheckBox from "@/components/dashboard/mahasiswa/JawabanCheckbox";
import { getDetailPesertaDosen } from "@/services/UjianServices";
import type { JawabanEssay } from "@/types";

function JawabanEssayCard({ data }: { data: JawabanEssay[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter(d => d.soal.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[var(--color-primary)]">Jawaban Essay</h2>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari soal..." />
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((row, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="text-xs font-medium text-gray-700">
                <span className="text-gray-400 mr-2">{String(row.no).padStart(2, "0")}.</span>
                {row.soal}
              </p>
              <span className="shrink-0 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600">
                {row.poin} poin
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-700 whitespace-pre-wrap mb-2">
              {row.jawaban || <span className="text-gray-400 italic">Tidak ada jawaban</span>}
            </div>
            {row.ai_feedback && (
              <div className="bg-[var(--color-primary-light)] rounded-lg px-3 py-2 text-xs text-[var(--color-primary)]">
                <span className="font-medium">AI Feedback: </span>{row.ai_feedback}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Tidak ada data.</p>
        )}
      </div>
    </div>
  );
}

export default function DetailPesertaDosenPage({ params }: { params: Promise<{ id: string; pesertaId: string }> }) {
  const { id, pesertaId } = use(params);

  const { data, isLoading } = useSWR(
    `/ujian/dosen/hasil/${id}/peserta/${pesertaId}`,
    () => getDetailPesertaDosen(id, pesertaId),
    { revalidateOnFocus: false }
  );

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <Breadcrumb overrides={data ? { [id]: data.info.nama_ujian, [pesertaId]: data.info.nama_peserta } : undefined} />
      </div>

      {isLoading ? <NilaiDetailSkeleton /> : !data ? null : (
        <>
          {/* Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-primary)" }}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800">{data.info.nama_peserta}</p>
                  <p className="text-xs text-gray-400">{data.info.nim} · {data.info.mata_kuliah}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{data.info.nama_ujian}</p>
                </div>
              </div>
              {data.info.nilai !== null && (
                <div className="text-white text-sm font-semibold px-5 py-2 rounded-xl shrink-0"
                  style={{ background: data.info.lulus ? "var(--color-primary)" : "#ef4444" }}>
                  Nilai: {data.info.nilai}
                </div>
              )}
            </div>

          </div>

          {data.jawaban.pilihan_ganda.length > 0 && (
            <JawabanPilihanGanda data={data.jawaban.pilihan_ganda} />
          )}
          {data.jawaban.checklist.length > 0 && (
            <JawabanCheckBox data={data.jawaban.checklist} />
          )}
          {data.jawaban.essay.length > 0 && (
            <JawabanEssayCard data={data.jawaban.essay} />
          )}
        </>
      )}
    </div>
  );
}
