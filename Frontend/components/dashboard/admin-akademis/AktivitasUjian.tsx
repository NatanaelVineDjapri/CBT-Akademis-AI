"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ClipboardList } from "lucide-react";
import { getAdminAkademisAktivitasUjian } from "@/services/DashboardServices";
import EmptyState from "@/components/EmptyState";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-semibold text-gray-700 mb-1">{d.nama}</p>
      <p style={{ color: "var(--color-primary)" }}>Total Ujian: <span className="font-bold">{d.total}</span></p>
    </div>
  );
}

const COLORS = [
  "var(--color-primary)", "#22c55e", "#f59e0b", "#a855f7", "#ef4444",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1",
];

export default function AktivitasUjian() {
  const { data, isLoading } = useSWR(
    "/dashboard/admin-akademis/aktivitas-ujian",
    getAdminAkademisAktivitasUjian,
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

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Aktivitas Ujian per Universitas</span>
        </div>
        <div className="min-h-[180px] flex items-center justify-center"><EmptyState flat size={64} message="Belum ada data ujian." /></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={15} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Aktivitas Ujian per Universitas</span>
      </div>

      <div style={{ height: data.length * 40 + 20 }} className="min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 4, bottom: 0 }} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="nama"
              width={80}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 11) + "…" : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="total" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
