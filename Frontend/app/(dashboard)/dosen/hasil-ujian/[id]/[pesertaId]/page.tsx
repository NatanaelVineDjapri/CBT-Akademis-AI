"use client";

import { use, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { User, CheckCircle, Clock, Pencil, RotateCcw } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import NilaiDetailSkeleton from "@/components/skeleton/NilaiDetailSkeleton";
import JawabanPilihanGanda from "@/components/dashboard/mahasiswa/JawabanPilihanGanda";
import JawabanCheckBox from "@/components/dashboard/mahasiswa/JawabanCheckbox";
import { getDetailPesertaDosen, periksaEssay, resetEssay } from "@/services/UjianServices";
import type { JawabanEssay } from "@/types";

function JawabanEssayCard({
  data,
  ujianId,
  pesertaId,
  onSaved,
}: {
  data: JawabanEssay[];
  ujianId: string;
  pesertaId: string;
  onSaved: () => void;
}) {
  const needsGrading = data.some(d => !d.is_manual_graded);
  const [isEditing, setIsEditing] = useState(needsGrading);
  const [search, setSearch] = useState("");
  const [nilaiMap, setNilaiMap] = useState<Record<number, string>>(() =>
    Object.fromEntries(data.map(d => [d.id, d.is_manual_graded ? String(d.poin) : ""]))
  );
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>(() =>
    Object.fromEntries(data.map(d => [d.id, d.dosen_feedback ?? ""]))
  );
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [saveError, setSaveError] = useState("");

  const filtered = data.filter(d => d.soal.toLowerCase().includes(search.toLowerCase()));
  const showInputs = isEditing || needsGrading;

  const allFilled = data.every(d => nilaiMap[d.id] !== "" && nilaiMap[d.id] !== undefined);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const penilaian = data.map(d => ({
        id: d.id,
        nilai: Math.min(parseFloat(nilaiMap[d.id] || "0") || 0, d.bobot),
        dosen_feedback: feedbackMap[d.id] || undefined,
      }));
      await periksaEssay(ujianId, pesertaId, penilaian);
      await globalMutate(`/ujian/dosen/hasil/${ujianId}`);
      setIsEditing(false);
      onSaved();
    } catch {
      setSaveError("Gagal menyimpan penilaian. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setSaveError("");
    try {
      await resetEssay(ujianId, pesertaId);
      await globalMutate(`/ujian/dosen/hasil/${ujianId}`);
      setNilaiMap(Object.fromEntries(data.map(d => [d.id, ""])));
      setFeedbackMap(Object.fromEntries(data.map(d => [d.id, ""])));
      setIsEditing(true);
      onSaved();
    } catch {
      setSaveError("Gagal mereset penilaian. Coba lagi.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[var(--color-primary)]">Jawaban Essay</h2>
          {needsGrading ? (
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--color-warning-light)", color: "var(--color-warning)" }}>
              <Clock className="w-3 h-3" />
              Perlu Dinilai
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
              <CheckCircle className="w-3 h-3" />
              Sudah Dinilai
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!needsGrading && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              <Pencil className="w-3 h-3" />
              Edit Penilaian
            </button>
          )}
          <SearchInput value={search} onChange={setSearch} placeholder="Cari soal..." />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((row) => (
          <div key={row.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="text-xs font-medium text-gray-700">
                <span className="text-gray-400 mr-2">{String(row.no).padStart(2, "0")}.</span>
                {row.soal}
              </p>
              {showInputs ? (
                <div className="shrink-0 flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={row.bobot}
                    step={0.5}
                    value={nilaiMap[row.id] ?? ""}
                    onChange={e => setNilaiMap(prev => ({ ...prev, [row.id]: e.target.value }))}
                    placeholder="0"
                    className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center font-semibold focus:outline-none text-gray-500"
                    // style={{ borderColor: "var(--color-primary)" }}
                  />
                  <span className="text-xs text-gray-400">/ {row.bobot} poin</span>
                </div>
              ) : (
                <span className="shrink-0 border rounded-lg px-2 py-1 text-xs font-semibold"
                  style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                  {row.poin} / {row.bobot} poin
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-700 whitespace-pre-wrap mb-2">
              {row.jawaban || <span className="text-gray-400 italic">Tidak ada jawaban</span>}
            </div>

            {row.ai_feedback && (
              <div className="bg-[var(--color-primary-light)] rounded-lg px-3 py-2 text-xs text-[var(--color-primary)] mb-2">
                <span className="font-medium">AI Feedback: </span>{row.ai_feedback}
              </div>
            )}
            {showInputs ? (
              <textarea
                rows={2}
                value={feedbackMap[row.id] ?? ""}
                onChange={e => setFeedbackMap(prev => ({ ...prev, [row.id]: e.target.value }))}
                placeholder="Catatan dosen (opsional)..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none resize-none"
                // style={{ borderColor: "var(--color-primary-light)" }}
              />
            ) : row.dosen_feedback ? (
              <div className="rounded-lg px-3 py-2 text-xs text-gray-700 border border-dashed border-gray-300">
                <span className="font-medium text-gray-500">Catatan Dosen: </span>{row.dosen_feedback}
              </div>
            ) : null}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Tidak ada data.</p>
        )}
      </div>

      {showInputs && (
        <div className="mt-4 flex flex-col gap-2">
          {saveError && (
            <p className="text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg">{saveError}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              disabled={resetting || saving}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border cursor-pointer disabled:opacity-50 disabled:cursor-default"
              style={{ borderColor: "#fca5a5", color: "#ef4444" }}
            >
              <RotateCcw className="w-3 h-3" />
              {resetting ? "Mereset..." : "Tandai Belum Diperiksa"}
            </button>
            <div className="flex items-center gap-2">
              {isEditing && !needsGrading && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-medium px-4 py-2 rounded-lg border cursor-pointer"
                  style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                >
                  Batal
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving || resetting || !allFilled}
                className="text-white text-sm font-medium px-6 py-2 rounded-xl disabled:opacity-50 cursor-pointer disabled:cursor-default"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {saving ? "Menyimpan..." : "Simpan Penilaian"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DetailPesertaDosenPage({ params }: { params: Promise<{ id: string; pesertaId: string }> }) {
  const { id, pesertaId } = use(params);

  const { data, isLoading, mutate } = useSWR(
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
            <JawabanEssayCard
              data={data.jawaban.essay}
              ujianId={id}
              pesertaId={pesertaId}
              onSaved={() => mutate()}
            />
          )}
        </>
      )}
    </div>
  );
}
