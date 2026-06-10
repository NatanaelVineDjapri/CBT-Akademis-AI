"use client";

import useSWR from "swr";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { GraduationCap } from "lucide-react";
import { getAdminUniversitasDistribusi } from "@/services/DashboardServices";

const COLORS = [
  "var(--color-primary)",
  "#22c55e", "#f59e0b", "#a855f7", "#ef4444",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1",
];

export default function DistribusiMahasiswa() {
  const { data, isLoading } = useSWR(
    "/dashboard/admin-universitas/distribusi",
    getAdminUniversitasDistribusi,
    { revalidateOnFocus: false }
  );

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-48 mb-6" />
        <div className="h-[200px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={15} style={{ color: "var(--color-primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Distribusi Mahasiswa per Fakultas</span>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">Belum ada data mahasiswa.</p>
      </div>
    );
  }

  const slices = data.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));
  const total  = slices.reduce((s, d) => s + d.total, 0);
  const largest = slices.reduce((a, b) => a.total > b.total ? a : b);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap size={15} style={{ color: "var(--color-primary)" }} />
        <span className="text-sm font-semibold text-gray-800">Distribusi Mahasiswa per Fakultas</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-44 h-44 flex-shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="total"
                nameKey="nama"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={85}
                strokeWidth={2}
                stroke="#fff"
              >
                {slices.map((_, i) => (
                  <Cell key={i} fill={slices[i].color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  return (
                    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-md text-xs">
                      <p className="font-semibold text-gray-800">{d.name}</p>
                      <p className="text-gray-500">
                        {d.value} mahasiswa · {Math.round(((d.value as number) / total) * 100)}%
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-800">{total}</span>
            <span className="text-[10px] text-gray-400">total</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-44 pr-1 scrollbar-thin">
          {slices.map((d) => {
            const pct = Math.round((d.total / total) * 100);
            return (
              <div key={d.nama}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-600 line-clamp-1">{d.nama}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 ml-2 shrink-0">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, white)" }}
      >
        <GraduationCap size={13} style={{ color: "var(--color-primary)" }} className="flex-shrink-0" />
        <p className="text-xs text-gray-600">
          <span className="font-semibold">{largest.nama}</span> memiliki mahasiswa terbanyak dengan{" "}
          <span className="font-semibold" style={{ color: "var(--color-primary)" }}>{largest.total} mahasiswa</span>
        </p>
      </div>
    </div>
  );
}
