"use client";

import useSWR from "swr";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";
import { getAdminAkademisPertumbuhanPengguna } from "@/services/DashboardServices";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === "mahasiswa" ? "Mahasiswa" : "Dosen"}:{" "}
          <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function PertumbuhanPengguna() {
  const { data, isLoading } = useSWR(
    "/dashboard/admin-akademis/pertumbuhan-pengguna",
    getAdminAkademisPertumbuhanPengguna,
    { revalidateOnFocus: false }
  );

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-52 mb-6" />
        <div className="h-[220px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  const isEmpty = data.every(d => d.mahasiswa === 0 && d.dosen === 0);

  if (isEmpty) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Pertumbuhan Pengguna (6 Bulan)</span>
        </div>
        <p className="text-xs text-gray-400">Belum ada data pengguna dalam 6 bulan terakhir.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={15} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Pertumbuhan Pengguna (6 Bulan)</span>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} width={28} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 11, color: "#6B7280" }}>
                  {value === "mahasiswa" ? "Mahasiswa" : "Dosen"}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="mahasiswa"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="dosen"
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
