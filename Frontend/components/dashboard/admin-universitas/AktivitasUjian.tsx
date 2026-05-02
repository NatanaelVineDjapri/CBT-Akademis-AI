"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ClipboardList } from "lucide-react";
import { getAdminUniversitasAktivitasUjian } from "@/services/DashboardServices";

const COLORS = [
  "#0ea5e9","#22c55e","#f59e0b","#a855f7","#ef4444",
  "#14b8a6","#f97316","#6366f1","#ec4899","#84cc16",
  "#06b6d4","#8b5cf6","#fb923c","#34d399","#fbbf24",
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const items = payload.filter((p: any) => p.value > 0);
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs max-w-[200px]">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {items.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function AktivitasUjian() {
  const { data, isLoading } = useSWR(
    "/dashboard/admin-universitas/aktivitas-ujian",
    getAdminUniversitasAktivitasUjian,
    { revalidateOnFocus: false }
  );

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-48 mb-6" />
        <div className="h-[220px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!data.data?.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Aktivitas Ujian per Prodi</span>
        </div>
        <p className="text-xs text-gray-400">Belum ada data ujian.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={15} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Aktivitas Ujian per Prodi</span>
      </div>

      <div style={{ height: data.data.length * 36 + 20 }} className="min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.data} layout="vertical" margin={{ top: 0, right: 40, left: 4, bottom: 0 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="nama"
              width={110}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 15) + "…" : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            {data.keys.map((key: string, i: number) => (
              <Bar key={key} dataKey={key} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === data.keys.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
