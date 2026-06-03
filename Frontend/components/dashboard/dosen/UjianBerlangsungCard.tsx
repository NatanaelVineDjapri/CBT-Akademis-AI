"use client";

import Link from "next/link";
import { Clock, ClipboardList, Calendar } from "lucide-react";
import type { DosenUjianItem } from "@/types";

export default function UjianBerlangsungCard({ data }: { data: DosenUjianItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Ujian Sedang Berlangsung</span>
        </div>
        <Link
          href="/dosen/monitoring"
          className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80"
          style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
        >
          Lihat Semua
        </Link>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400 flex-1">Tidak ada ujian yang sedang berlangsung.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((ujian) => (
            <div key={ujian.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  <ClipboardList size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{ujian.nama}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={11} /> {ujian.start_date}
                    </span>
                    {ujian.jam && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={11} /> {ujian.jam}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href="/dosen/monitoring"
                className="text-xs text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Monitor
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
