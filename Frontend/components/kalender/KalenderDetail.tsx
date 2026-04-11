"use client";

import { X } from "lucide-react";
import type { JadwalEvent } from "@/types";

interface Props {
  event: JadwalEvent | null;
  onClose: () => void;
}

export default function DetailJadwalModal({ event, onClose }: Props) {
  if (!event) return null;

  const formatDate = (date: string) => {
    return (
      new Date(date).toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      }) + " WIB"
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-600";
      case "berlangsung":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <h3 className="text-base font-bold text-white">Detail Jadwal</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 text-xs mb-1">Judul</p>
            <p className="font-semibold text-base">{event.title}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-1">Mata Kuliah</p>
            <p className="font-semibold text-base">
              {event.mata_kuliah || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-1">Mulai</p>
            <p className="font-semibold text-base">{formatDate(event.start)}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-1">Selesai</p>
            <p className="font-semibold text-base">
              {event.end ? formatDate(event.end) : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Status</p>
            <span
              className={`inline-block px-5 py-3 text-xs rounded-lg ${getStatusColor(
                event.status,
              )}`}
            >
              {event.status || "-"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
