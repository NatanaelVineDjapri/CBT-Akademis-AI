"use client";

import { ChevronLeft, Video } from "lucide-react";
import LiveVideoTile from "@/components/dashboard/dosen/monitoring/LiveVideoTile";

interface LiveViewPeserta {
  peserta_ujian_id: number;
  nama: string | null;
  nim: string | null;
  status: string;
}

interface Props {
  namaUjian?: string;
  peserta: LiveViewPeserta[];
  onBack: () => void;
}

/**
 * Papan Live View peserta ujian (grid kamera ala Zoom).
 * Dipakai bersama oleh halaman monitoring dosen & admin universitas (PMB).
 */
export default function LiveViewBoard({ namaUjian, peserta, onBack }: Props) {
  const aktif = peserta.filter(p => p.status === "sedang_berlangsung");

  const cols =
    aktif.length <= 1 ? 1 :
    aktif.length <= 4 ? 2 :
    aktif.length <= 9 ? 3 : 4;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold truncate" style={{ color: "var(--color-primary)" }}>
            Live View
          </h1>
          <p className="text-xs text-gray-400">{namaUjian ?? "Loading..."}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: "var(--color-warning)" }}>
            {aktif.length} aktif
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 bg-gray-950 rounded-b-2xl">
        {aktif.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
              <Video size={24} className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-500">Tidak ada peserta aktif saat ini.</p>
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {aktif.map(p => (
              <LiveVideoTile
                key={p.peserta_ujian_id}
                pesertaUjianId={p.peserta_ujian_id}
                nama={p.nama}
                nim={p.nim}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
