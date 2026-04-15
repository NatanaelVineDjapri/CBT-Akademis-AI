"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { DosenUjianItem } from "@/services/DashboardServices";

export default function UjianSelesaiCard({ data }: { data: DosenUjianItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Ujian Selesai</span>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada ujian selesai </p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {data.map((ujian) => (
            <div
              key={ujian.id}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {ujian.nama}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ujian.mata_kuliah} · {ujian.end_date}
                </p>
              </div>
              <Link
                href="/dosen/hasil-ujian"
                className="text-xs text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Nilai
              </Link>
            </div>
          ))}
        </div>
      )}

      {data.length > 0 && (
        <Link
          href="/dosen/ujian"
          className="mt-4 block w-full text-xs border text-center rounded-lg px-3 py-2 transition-colors hover:opacity-80"
          style={{
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)",
          }}
        >
          Lihat Semua
        </Link>
      )}
    </div>
  );
}
