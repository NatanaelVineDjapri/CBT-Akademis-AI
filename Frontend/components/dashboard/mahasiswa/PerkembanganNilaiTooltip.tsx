"use client";

import type { DashboardPerkembanganItem } from "@/services/DashboardServices";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PerkembanganNilaiTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as DashboardPerkembanganItem;
  const rata = payload.find(
    (p: { dataKey: string }) => p.dataKey === "rata",
  )?.value;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs min-w-[180px]">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map(
        (p: {
          dataKey: string;
          name: string;
          value: number;
          color: string;
        }) => (
          <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-semibold text-gray-700">{p.value}</span>
          </div>
        ),
      )}
      {d.matkul_tinggi && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">↑</span>
            <span className="text-gray-500">
              Terbaik:{" "}
              <span className="font-medium text-gray-700">
                {d.matkul_tinggi}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {rata < 80 ? (
              <span className="text-red-400">↓</span>
            ) : (
              <span className="text-amber-400">!</span>
            )}
            <span className="text-gray-500">
              {rata < 80 ? "Perlu perhatian: " : "Pantau: "}
              <span className="font-medium text-gray-700">
                {d.matkul_rendah}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
