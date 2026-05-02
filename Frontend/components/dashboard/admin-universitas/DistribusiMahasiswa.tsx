"use client";

import useSWR from "swr";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GraduationCap } from "lucide-react";
import { getAdminUniversitasDistribusi } from "@/services/DashboardServices";

const COLORS = [
  "var(--color-primary)",
  "#22c55e", "#f59e0b", "#a855f7", "#ef4444",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1",
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-semibold text-gray-700">{d.nama}</p>
      <p className="text-gray-500 mt-0.5">
        <span style={{ color: payload[0].color }} className="font-bold">{d.total}</span> mahasiswa
      </p>
    </div>
  );
}

function CustomLegend({ payload }: any) {
  return (
    <ul className="flex flex-col gap-1.5 justify-center">
      {payload.map((entry: any) => (
        <li key={entry.value} className="flex items-center gap-2 text-xs text-gray-600">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.value}</span>
          <span className="font-semibold text-gray-800 ml-auto">{entry.payload.total}</span>
        </li>
      ))}
    </ul>
  );
}

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
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Distribusi Mahasiswa per Fakultas</span>
        </div>
        <p className="text-xs text-gray-400">Belum ada data mahasiswa.</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Distribusi Mahasiswa per Fakultas</span>
        </div>
        <span className="text-xs text-gray-400">{total} total</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="nama"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 min-w-0 overflow-y-auto max-h-[180px]">
          <CustomLegend payload={data.map((d, i) => ({
            value: d.nama,
            color: COLORS[i % COLORS.length],
            payload: d,
          }))} />
        </div>
      </div>
    </div>
  );
}
