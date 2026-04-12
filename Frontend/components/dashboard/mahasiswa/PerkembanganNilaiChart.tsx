"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DashboardPerkembanganItem } from "@/services/DashboardServices";
import PerkembanganNilaiTooltip from "./PerkembanganNilaiTooltip";

export default function PerkembanganNilaiChart({
  data,
}: {
  data: DashboardPerkembanganItem[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-800 mb-1">
        Perkembangan Nilai
      </p>
      <p className="text-xs text-gray-400 mb-4">
        Arahkan kursor untuk melihat insight mata kuliah
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="bulan"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<PerkembanganNilaiTooltip />} />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
          <Line
            type="monotone"
            dataKey="rata"
            name="Rata-rata Nilai"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="tertinggi"
            name="Nilai Tertinggi"
            stroke="var(--color-warning, #f59e0b)"
            strokeWidth={2}
            dot={{ r: 3 }}
            strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
