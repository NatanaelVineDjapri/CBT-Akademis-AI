"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";
import { getAdminAkademisDistribusiPengguna } from "@/services/DashboardServices";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-semibold text-gray-700 mb-1">{d.nama}</p>
      <p style={{ color: "var(--color-primary)" }}>Dosen: <span className="font-bold">{d.dosen}</span></p>
      <p className="text-green-600">Mahasiswa: <span className="font-bold">{d.mahasiswa}</span></p>
    </div>
  );
}

export default function DistribusiPengguna() {
  const { data, isLoading } = useSWR(
    "/dashboard/admin-akademis/distribusi-pengguna",
    getAdminAkademisDistribusiPengguna,
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
          <Users size={15} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Distribusi Pengguna per Universitas</span>
        </div>
        <p className="text-xs text-gray-400">Belum ada data pengguna.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={15} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Distribusi Pengguna per Universitas</span>
      </div>

      <div style={{ height: data.length * 40 + 40 }} className="min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
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
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="dosen" name="Dosen" stackId="a" fill="var(--color-primary)" opacity={0.85} />
            <Bar dataKey="mahasiswa" name="Mahasiswa" stackId="a" fill="#22c55e" opacity={0.85} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
