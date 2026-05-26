"use client";

import { X, Video } from "lucide-react";
import LiveVideoTile from "./LiveVideoTile";
import type { MonitoringPeserta } from "@/services/MonitoringServices";

interface Props {
  ujianNama: string;
  peserta:   MonitoringPeserta[];
  onClose:   () => void;
}

export default function LiveViewGrid({ ujianNama, peserta, onClose }: Props) {
  const aktif = peserta.filter(p => p.status === "sedang_berlangsung");

  const cols =
    aktif.length <= 1 ? 1 :
    aktif.length <= 4 ? 2 :
    aktif.length <= 9 ? 3 : 4;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">Live View</span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400 truncate max-w-xs">{ujianNama}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--color-warning-light)", color: "var(--color-warning)" }}>
            {aktif.length} aktif
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Grid */}
      <div className="p-4 bg-gray-950">
        {aktif.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
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
