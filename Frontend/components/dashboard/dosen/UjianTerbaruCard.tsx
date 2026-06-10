"use client";

import Link from "next/link";
import { ClipboardList, Calendar, Clock } from "lucide-react";
import type { DosenUjianItem } from "@/types";

export default function UjianTerbaruCard({ data }: { data: DosenUjianItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <ClipboardList size={16} className="text-gray-500 shrink-0" />
          <span className="text-sm font-semibold truncate" style={{ color: "var(--color-primary)" }}>Ujian Terbaru</span>
        </div>
        {data.length > 0 && (
          <Link
            href="/dosen/ujian"
            className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80 shrink-0 whitespace-nowrap"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {data.length === 0 ? (
<p className="text-xs text-gray-400">
          Tidak ada ujian terbaru.
        </p>      ) : (
        <div className="flex flex-col flex-1 justify-between gap-3">
          {data.map((ujian) => (
            <div
              key={ujian.id}
              className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <ClipboardList size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{ujian.nama}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={11} /> {ujian.start_date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} /> {ujian.jam}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/dosen/ujian"
                className="text-xs text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
