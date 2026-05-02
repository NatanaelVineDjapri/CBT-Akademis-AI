"use client";

import useSWR from "swr";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users } from "lucide-react";
import { getPmbStatistik } from "@/services/PmbPenerimaanServices";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-semibold text-gray-700 mb-1">Tahun {label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
      {payload.length === 2 && payload[0].value > 0 && (
        <p className="text-gray-400 mt-1">
          Diterima: {Math.round((payload[1].value / payload[0].value) * 100)}%
        </p>
      )}
    </div>
  );
}

export default function GrafikPenerimaan() {
  const { data, isLoading } = useSWR("/pmb/penerimaan/statistik", getPmbStatistik, {
    revalidateOnFocus: false,
  });

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-56 mb-6" />
        <div className="h-[200px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Penerimaan PMB per Tahun</span>
        </div>
        <p className="text-xs text-gray-400">Belum ada data penerimaan PMB.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Penerimaan PMB per Tahun</span>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-pendaftar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-diterima" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  style={{ stopColor: "var(--color-primary)", stopOpacity: 0.2 }} />
                <stop offset="95%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="tahun" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} width={32} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280", paddingTop: 8 }} iconType="circle" iconSize={8} />
            <Area type="monotone" dataKey="total_pendaftar" name="Pendaftar" stroke="#94a3b8" strokeWidth={2} fill="url(#grad-pendaftar)" dot={{ r: 3, fill: "#94a3b8", stroke: "#fff", strokeWidth: 2 }} />
            <Area type="monotone" dataKey="total_diterima"  name="Diterima"  stroke="var(--color-primary)" strokeWidth={2} fill="url(#grad-diterima)" dot={{ r: 3, fill: "var(--color-primary)", stroke: "#fff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
