"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { CheckCircle } from "lucide-react";
import { getAdminUniversitasKelulusan } from "@/services/DashboardServices";
import EmptyState from "@/components/EmptyState";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs max-w-[180px]">
      <p className="font-semibold text-gray-700 mb-1">{d.nama}</p>
      <p style={{ color: "var(--color-primary)" }}>
        Kelulusan: <span className="font-bold">{d.persentase}%</span>
      </p>
      <p className="text-gray-400">{d.lulus} / {d.total} peserta</p>
    </div>
  );
}

export default function TingkatKelulusan() {
  const { data, isLoading, error } = useSWR(
    "/dashboard/admin-universitas/kelulusan",
    getAdminUniversitasKelulusan,
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-52 mb-6" />
        <div className="h-[220px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={15} className="text-gray-500" />
          <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Tingkat Kelulusan per Fakultas</span>
        </div>
        <div className="min-h-[180px] flex items-center justify-center"><EmptyState flat size={64} message="Belum ada data nilai mahasiswa." /></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle size={15} className="text-gray-500" />
        <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Tingkat Kelulusan per Fakultas</span>
      </div>

      <div style={{ height: data.length * 36 + 20 }} className="min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 4, bottom: 0 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
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
            <ReferenceLine x={60} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="persentase" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.persentase >= 60 ? "var(--color-primary)" : "#f87171"} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
