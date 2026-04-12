"use client";

import { Calendar, Clock, BookOpen, CheckCircle, XCircle, Timer } from "lucide-react";
import type { UjianMahasiswa } from "@/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function UjianCard({ ujian }: { ujian: UjianMahasiswa }) {
  const selesai = ujian.status === "selesai";

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "var(--color-primary)" }}
      >
        <BookOpen className="w-6 h-6 text-white" />
      </div>

      {/* Nama + Mata Kuliah */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-bold text-gray-800 leading-snug">{ujian.nama_ujian}</p>
        <p className="text-xs text-gray-400">{ujian.mata_kuliah}</p>
      </div>

      <div className="border-t border-gray-200" />

      {/* Tanggal & Waktu */}
      <div className="flex flex-col gap-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="shrink-0" />
          <span>{formatDate(ujian.start_date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="shrink-0" />
          <span>{formatTime(ujian.start_date)} – {formatTime(ujian.end_date)}</span>
        </div>
      </div>

      {/* Durasi & Soal */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
        <div className="flex items-center gap-1">
          <Timer size={12} />
          <span>Durasi: {ujian.durasi_menit} menit</span>
        </div>
        <span>Soal: {ujian.jumlah_soal}</span>
      </div>

      <div className="border-t border-gray-200" />

      {/* Nilai atau Tombol */}
      {selesai && ujian.nilai !== null ? (
        <div className="flex flex-col gap-2">
          <div
            className="rounded-xl p-3 flex flex-col items-center gap-1"
            style={{ backgroundColor: ujian.lulus ? "#e0f7f5" : "#fef2f2" }}
          >
            <p className="text-xs text-gray-500">Nilai Anda</p>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold" style={{ color: ujian.lulus ? "var(--color-primary)" : "#ef4444" }}>
                {ujian.nilai}
              </p>
              <span className="text-gray-300 mb-1">|</span>
              <p className="text-2xl font-bold mb-0.5" style={{ color: ujian.lulus ? "var(--color-primary)" : "#ef4444" }}>
                {ujian.grade}
              </p>
            </div>
          </div>
          <button
            className="w-full py-2 rounded-lg text-white text-xs font-medium"
            style={{ background: "var(--color-primary)" }}
          >
            Lihat Detail
          </button>
        </div>
      ) : (
        <button
          disabled={ujian.status !== "sedang_berlangsung"}
          className="w-full py-2 rounded-lg text-white text-xs font-medium disabled:opacity-40"
          style={{ background: "var(--color-primary)" }}
        >
          {ujian.status === "sedang_berlangsung" ? "Mulai Ujian" : "Belum Dimulai"}
        </button>
      )}
    </div>
  );
}
