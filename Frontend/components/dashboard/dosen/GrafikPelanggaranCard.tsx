"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ShieldAlert } from "lucide-react";

const SLICES = [
  { name: "Matematika", value: 20, light: "var(--color-primary-light)",    color: "var(--color-primary)" },
  { name: "Fisika",     value: 30, light: "var(--color-warning-light)",    color: "var(--color-warning)" },
  { name: "Mandarin",   value: 15, light: "var(--akademik-univ-bg)",       color: "var(--akademik-univ-icon)" },
  { name: "PPKn",       value: 25, light: "var(--akademik-tahun-bg)",      color: "var(--akademik-tahun-icon)" },
  { name: "Biologi",    value: 10, light: "var(--akademik-alamat-bg)",     color: "var(--akademik-alamat-icon)" },
];

const total = SLICES.reduce((s, d) => s + d.value, 0);
const worst = SLICES.reduce((a, b) => a.value > b.value ? a : b);

export default function GrafikPelanggaranCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      {/* Hidden SVG defs — stopColor via style supaya CSS vars ter-resolve */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {SLICES.map((s, i) => (
            <linearGradient key={i} id={`pelanggaran-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: s.light }} />
              <stop offset="100%" style={{ stopColor: s.color }} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={15} style={{ color: "var(--color-primary)" }} />
        <span className="text-sm font-semibold text-gray-800">Tingkat Pelanggaran per Mata Kuliah</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut chart */}
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SLICES}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={85}
                strokeWidth={2}
                stroke="#fff"
              >
                {SLICES.map((_, i) => (
                  <Cell key={i} fill={`url(#pelanggaran-grad-${i})`} />
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
                        {d.value} pelanggaran · {Math.round((d.value as number / total) * 100)}%
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

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-2.5">
          {SLICES.map((d) => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-xs text-gray-600">{d.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worst highlight */}
      <div
        className="mt-auto pt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ backgroundColor: "var(--color-warning-light)" }}
      >
        <ShieldAlert size={13} style={{ color: "var(--color-warning)" }} className="flex-shrink-0" />
        <p className="text-xs text-gray-600">
          <span className="font-semibold">{worst.name}</span> memiliki pelanggaran tertinggi dengan{" "}
          <span className="font-semibold" style={{ color: "var(--color-warning)" }}>{worst.value} kasus</span>
        </p>
      </div>
    </div>
  );
}
