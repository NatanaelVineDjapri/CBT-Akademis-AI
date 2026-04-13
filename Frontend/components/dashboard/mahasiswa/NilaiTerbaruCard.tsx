"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { DashboardNilaiItem } from "@/services/DashboardServices";
import { getBarColor, getInsight } from "@/utils/nilai";

export default function NilaiTerbaruCard({
  data,
}: {
  data: DashboardNilaiItem[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <GraduationCap size={15} style={{ color: "var(--color-primary)" }} />
        <span className="text-sm font-semibold text-gray-800">
          Nilai Terbaru
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada riwayat nilai.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {data.map((d) => {
            const insight = getInsight(d.nilai, d.nama);
            return (
              <div
                key={d.nama + d.tanggal}
                className="group py-3 first:pt-0 relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">
                    {d.nama}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: getBarColor(d.nilai) }}
                  >
                    {d.nilai}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{d.tanggal}</p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.nilai}%`,
                      backgroundColor: getBarColor(d.nilai),
                    }}
                  />
                </div>
                <div className="absolute left-0 right-0 bottom-full mb-1 hidden group-hover:block z-10">
                  <div
                    className="rounded-lg px-3 py-2 text-xs shadow-lg border"
                    style={
                      d.nilai >= 65
                        ? {
                            backgroundColor: "var(--color-primary-light, #E1F5EE)",
                            borderColor: "var(--color-primary, #097797)",
                            color: "var(--color-primary, #097797)",
                          }
                        : {
                            backgroundColor: "var(--color-danger-light, #fef2f2)",
                            borderColor: "var(--color-danger, #ef4444)",
                            color: "var(--color-danger, #ef4444)",
                          }
                    }
                  >
                    <span className="mr-1">{insight.icon}</span>
                    {insight.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/mahasiswa/nilai"
        className="w-full text-white text-xs font-medium py-2.5 rounded-xl transition-colors text-center block"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Lihat Semua
      </Link>
    </div>
  );
}
