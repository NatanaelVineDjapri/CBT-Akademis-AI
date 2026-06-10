"use client";

import useSWR from "swr";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { getAdminUniversitasTrenNilai } from "@/services/DashboardServices";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-semibold text-gray-700 mb-0.5">{label}</p>
      <p style={{ color: "var(--color-primary)" }}>
        Rata-rata: <span className="font-bold">{payload[0].value}</span>
      </p>
    </div>
  );
}

export default function TrenNilai() {
  const { data, isLoading } = useSWR(
    "/dashboard/admin-universitas/tren-nilai",
    getAdminUniversitasTrenNilai,
    { revalidateOnFocus: false }
  );

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-52 mb-6" />
        <div className="h-[200px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-gray-500" />
          <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Tren Rata-rata Nilai (6 Bulan)</span>
        </div>
        <p className="text-xs text-gray-400">Belum ada data nilai dalam 6 bulan terakhir.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <TrendingUp size={15} className="text-gray-500" />
        <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Tren Rata-rata Nilai (6 Bulan)</span>
      </div>

      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
            <YAxis domain={['auto', 'auto']} allowDecimals={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} width={28} />
            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rata_rata"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
