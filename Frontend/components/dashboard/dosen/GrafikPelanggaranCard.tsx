"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ShieldAlert } from "lucide-react";

const COLORS = [
  "var(--color-primary)",
  "var(--color-warning)",
  "var(--akademik-univ-icon)",
  "var(--akademik-tahun-icon)",
  "var(--akademik-alamat-icon)",
];

interface Props {
  data: { nama: string; total: number }[];
}

export default function GrafikPelanggaranCard({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert size={15} style={{ color: "var(--color-primary)" }} />
          <span className="text-sm font-semibold text-gray-800">Tingkat Pelanggaran per Mata Kuliah</span>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">Belum ada data pelanggaran.</p>
      </div>
    );
  }

  const slices = data.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));
  const total  = slices.reduce((s, d) => s + d.total, 0);
  const worst  = slices.reduce((a, b) => a.total > b.total ? a : b);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
<div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={15} style={{ color: "var(--color-primary)" }} />
        <span className="text-sm font-semibold text-gray-800">Tingkat Pelanggaran per Mata Kuliah</span>
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
                        {d.value} pelanggaran · {Math.round(((d.value as number) / total) * 100)}%
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

        <div className="flex-1 flex flex-col gap-2.5">
          {slices.map((d) => {
            const pct = Math.round((d.total / total) * 100);
            return (
              <div key={d.nama}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-600">{d.nama}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{pct}%</span>
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
        className="mt-6 lg:mt-auto flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ backgroundColor: "var(--color-warning-light)" }}
      >
        <ShieldAlert size={13} style={{ color: "var(--color-warning)" }} className="flex-shrink-0" />
        <p className="text-xs text-gray-600">
          <span className="font-semibold">{worst.nama}</span> memiliki pelanggaran tertinggi dengan{" "}
          <span className="font-semibold" style={{ color: "var(--color-warning)" }}>{worst.total} kasus</span>
        </p>
      </div>
    </div>
  );
}
