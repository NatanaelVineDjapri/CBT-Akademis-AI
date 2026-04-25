"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import type { DosenUjianItem } from "@/types";

export default function UjianBerlangsungCard({ data }: { data: DosenUjianItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Ujian Sedang Berlangsung</span>
      </div>

      {data.length === 0 ? (
 <p className="text-xs text-gray-400">
          Tidak ada ujian yang sedang berlangsung.
        </p>      ) : (
        <div className="flex flex-col gap-2">
          {data.map((ujian) => (
            <div key={ujian.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{ujian.nama}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ujian.mata_kuliah} · {ujian.start_date}</p>
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
