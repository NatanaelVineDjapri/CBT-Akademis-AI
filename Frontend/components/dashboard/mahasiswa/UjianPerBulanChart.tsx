"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DashboardBulananItem } from "@/services/DashboardServices";

export default function UjianPerBulanChart({
  data,
}: {
  data: DashboardBulananItem[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex-1 flex flex-col">
      <p className="text-sm font-semibold text-gray-800 mb-4">
        Ujian per Bulan
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              fontSize: "12px",
            }}
            cursor={{ fill: "#f9fafb" }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
          <Bar
            dataKey="selesai"
            name="Ujian Selesai"
            fill="var(--color-primary)"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
          <Bar
            dataKey="akan_datang"
            name="Akan Datang"
            fill="var(--ujianperbulan-akan-datang)"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
