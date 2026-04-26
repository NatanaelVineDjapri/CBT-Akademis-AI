"use client";

import Link from "next/link";
import { preload } from "swr";
import { getNilaiDetail } from "@/services/NilaiServices";
import { Calendar, Clock, ClipboardList, Timer } from "lucide-react";
import type { UjianMahasiswa } from "@/types";
import { formatDate, formatTime } from "@/utils/format";

export default function UjianCard({ ujian }: { ujian: UjianMahasiswa }) {
  const selesai = ujian.status === "selesai";

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2">
      {/* Icon + Nama + Mata Kuliah */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--color-primary)" }}
        >
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-bold text-gray-800 leading-snug truncate">
            {ujian.nama_ujian}
          </p>
          <p className="text-xs text-gray-400 truncate">{ujian.mata_kuliah}</p>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={11} className="shrink-0" />
          <span>{formatDate(ujian.start_date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} className="shrink-0" />
          <span>
            {formatTime(ujian.start_date)} – {formatTime(ujian.end_date)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-1">
        <div className="flex items-center gap-1">
          <Timer size={12} />
          <span>Durasi: {ujian.durasi_menit} menit</span>
        </div>
        <span>Soal: {ujian.jumlah_soal}</span>
      </div>

      <div className="border-t border-gray-200" />

      {selesai && ujian.nilai !== null ? (
        <div className="flex flex-col gap-2">
          <div
            className="rounded-xl p-3 flex flex-col items-center gap-1"
            style={{ backgroundColor: ujian.lulus ? "#e0f7f5" : "#fef2f2" }}
          >
            <p className="text-xs text-gray-500">Nilai Anda</p>
            <div className="flex items-end gap-3">
              <p
                className="text-xl font-bold"
                style={{
                  color: ujian.lulus ? "var(--color-primary)" : "#ef4444",
                }}
              >
                {ujian.nilai}
              </p>
              <span className="text-gray-300 mb-1">|</span>
              <p
                className="text-xl font-bold mb-0.5"
                style={{
                  color: ujian.lulus ? "var(--color-primary)" : "#ef4444",
                }}
              >
                {ujian.grade}
              </p>
            </div>
          </div>
          <Link
            href={`/mahasiswa/nilai/${ujian.nilai_akhir_id}`}
            className="block w-full py-2 rounded-lg text-white text-xs font-medium text-center"
            style={{ background: "var(--color-primary)" }}
            onMouseEnter={() =>
              preload(`/nilai/${ujian.nilai_akhir_id}`, () =>
                getNilaiDetail(ujian.nilai_akhir_id!),
              )
            }
          >
            Lihat Detail
          </Link>
        </div>
      ) : (
        <button
          disabled={ujian.status !== "sedang_berlangsung"}
          className="w-full py-2 rounded-lg text-white text-xs font-medium disabled:opacity-40"
          style={{ background: "var(--color-primary)" }}
        >
          {ujian.status === "sedang_berlangsung"
            ? "Mulai Ujian"
            : "Belum Dimulai"}
        </button>
      )}
    </div>
  );
}
