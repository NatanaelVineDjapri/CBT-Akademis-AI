"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { getDosenPerforma } from "@/services/DashboardServices";
import { PERFORMA_STATS } from "@/types";

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  return (
    <circle
      cx={cx} cy={cy} r={4} stroke="#fff" strokeWidth={2}
      style={{ fill: payload.lowPass ? "var(--color-warning)" : "var(--color-primary)" }}
    />
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-gray-700 mb-0.5">{d.ujian}</p>
      <p style={{ color: d.lowPass ? "var(--color-warning)" : "var(--color-primary)" }}>
        Rata-rata: <span className="font-semibold">{d.nilai}</span>
      </p>
    </div>
  );
}

export default function PerformaChart() {
  const [index, setIndex] = useState(0);
  const { data: matkulList, isLoading } = useSWR(
    "/dashboard/dosen/performa",
    getDosenPerforma,
    { revalidateOnFocus: false }
  );

  if (isLoading || !matkulList || matkulList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-100 rounded w-32" />
          <div className="h-7 bg-gray-100 rounded w-40" />
        </div>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => <div key={i} className="flex-1 h-14 bg-gray-100 rounded-xl" />)}
        </div>
        <div className="h-[180px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  const safeIndex = index % matkulList.length;
  const current = matkulList[safeIndex];
  const hasLowPass = current.ujian.some((u) => u.lowPass);
  const allPass = current.ujian.length > 0 && !hasLowPass;

  const values = current.ujian.map((u) => u.nilai);
  const minVal = values.length ? Math.max(0, Math.floor(Math.min(...values) / 10) * 10 - 10) : 0;
  const maxVal = values.length ? Math.min(100, Math.ceil(Math.max(...values) / 10) * 10 + 5) : 100;

  const stats = PERFORMA_STATS.map((s) => ({
    ...s,
    value: s.suffix ? `${current[s.key]}${s.suffix}` : current[s.key],
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-teal-600" />
          <span className="text-sm font-medium text-gray-800">Performa Ujian</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIndex((i) => (i - 1 + matkulList.length) % matkulList.length)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-white hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <ChevronLeft size={14} />
          </button>
          <div className="flex flex-col items-center min-w-[140px]">
            <span className="text-xs font-semibold text-gray-800 truncate max-w-full text-center">
              {current.matkul_nama}
            </span>
            <span className="text-[10px] text-gray-400">{safeIndex + 1} / {matkulList.length}</span>
          </div>
          <button
            onClick={() => setIndex((i) => (i + 1) % matkulList.length)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-white hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 mb-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-xl px-3 py-2.5"
            style={{ backgroundColor: s.bg }}
          >
            <p className="text-[10px] font-medium mb-0.5" style={{ color: s.color }}>{s.label}</p>
            <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {current.ujian.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center rounded-xl bg-gray-50">
          <p className="text-xs text-gray-400">Belum ada ujian untuk mata kuliah ini</p>
        </div>
      ) : (
        <>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={current.ujian} margin={{ top: 5, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="performa-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.15 }} />
                    <stop offset="95%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <ReferenceLine y={60} stroke="#e5e7eb" strokeDasharray="4 4" />
                <XAxis
                  dataKey="ujian"
                  tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[minVal, maxVal]}
                  tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="nilai"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#performa-fill)"
                  dot={<CustomDot />}
                  activeDot={{ r: 5, fill: "var(--color-primary)", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--color-primary)" }} />
              Di atas passing grade
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--color-warning)" }} />
              Di bawah passing grade
            </span>
            {allPass && (
              <span className="text-xs text-teal-600 font-medium ml-auto">Semua lulus ✓</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
