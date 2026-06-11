"use client";

import useSWR from "swr";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { getAdminUniversitasPerforma } from "@/services/DashboardServices";
import EmptyState from "@/components/EmptyState";

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

export default function StatistikPMBChart() {
  const { data, isLoading } = useSWR(
    "/dashboard/admin-universitas/performa",
    getAdminUniversitasPerforma,
    { revalidateOnFocus: false }
  );

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-48 mb-4" />
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => <div key={i} className="flex-1 h-14 bg-gray-100 rounded-xl" />)}
        </div>
        <div className="h-[180px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!data.stats || data.ujian.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} className="text-teal-600" />
          <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Statistik Ujian PMB</span>
        </div>
        <div className="min-h-[180px] flex items-center justify-center"><EmptyState flat size={64} message="Belum ada data ujian PMB yang selesai." /></div>
      </div>
    );
  }

  const values = data.ujian.map((u) => u.nilai);
  const minVal = Math.max(0, Math.floor(Math.min(...values) / 10) * 10 - 10);
  const maxVal = Math.min(100, Math.ceil(Math.max(...values) / 10) * 10 + 5);
  const hasLowPass = data.ujian.some((u) => u.lowPass);
  const allPass = !hasLowPass;

  const statCards = [
    { label: "Rata-rata Nilai", value: data.stats.rata_rata, bg: "var(--color-primary-light)", color: "var(--color-primary)" },
    { label: "Kelulusan", value: `${data.stats.persentase_kelulusan}%`, bg: "var(--akademik-prodi-bg)", color: "var(--akademik-prodi-icon)" },
    { label: "Total Peserta", value: data.stats.total_peserta, bg: "var(--akademik-tahun-bg)", color: "var(--akademik-tahun-icon)" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-teal-600" />
        <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Statistik Ujian PMB</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        {statCards.map((s) => (
          <div key={s.label} className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: s.bg }}>
            <p className="text-[10px] font-medium mb-0.5" style={{ color: s.color }}>{s.label}</p>
            <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.ujian} margin={{ top: 5, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pmb-fill" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#pmb-fill)"
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: "var(--color-primary)", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "var(--color-primary)" }} />
          Di atas passing grade
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "var(--color-warning)" }} />
          Di bawah passing grade
        </span>
        {allPass && data.ujian.length > 0 && (
          <span className="text-xs text-teal-600 font-medium ml-auto">Semua lulus ✓</span>
        )}
      </div>
    </div>
  );
}
