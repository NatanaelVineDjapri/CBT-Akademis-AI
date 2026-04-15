"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight, BarChart2, Percent, Users } from "lucide-react";

const performaData = [
  { ujian: "Ujian 1", nilai: 82, lowPass: false },
  { ujian: "Ujian 2", nilai: 45, lowPass: true },
  { ujian: "Ujian 3", nilai: 78, lowPass: false },
  { ujian: "Ujian 4", nilai: 38, lowPass: true },
  { ujian: "Ujian 5", nilai: 91, lowPass: false },
  { ujian: "Ujian 6", nilai: 52, lowPass: true },
  { ujian: "Ujian 7", nilai: 88, lowPass: false },
  { ujian: "Ujian 8", nilai: 41, lowPass: true },
  { ujian: "Ujian 9", nilai: 95, lowPass: false },
  { ujian: "Ujian 10", nilai: 60, lowPass: false },
];

const matkul = ["Matematika", "Fisika", "Bahasa Indonesia"];

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  const color = payload.lowPass ? "#F59E0B" : "#0D9488";
  return (
    <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
  );
}

export default function PerformaChart() {
  const [index, setIndex] = useState(0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-5">
        <button
          onClick={() => setIndex((i) => (i - 1 + matkul.length) % matkul.length)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:opacity-90 transition-colors"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          Performa Mata Kuliah {matkul[index]}
        </span>
        <button
          onClick={() => setIndex((i) => (i + 1) % matkul.length)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:opacity-90 transition-colors"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Body: stats kiri, chart kanan */}
      <div className="flex gap-4">
        {/* Stats kiri */}
        <div className="flex flex-col gap-3 min-w-[160px]">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ backgroundColor: "var(--color-primary-light, #e0f7fa)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
              <BarChart2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-medium leading-tight" style={{ color: "var(--color-primary)" }}>Rata – rata Nilai</p>
              <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>78.69</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-green-50 rounded-xl px-3 py-3">
            <div className="w-9 h-9 bg-green-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Percent size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-green-700 font-medium leading-tight">Persentase Kelulusan</p>
              <p className="text-sm font-semibold text-green-800">74%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-purple-50 rounded-xl px-3 py-3">
            <div className="w-9 h-9 bg-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-purple-700 font-medium leading-tight">Jumlah Mahasiswa</p>
              <p className="text-sm font-semibold text-purple-800">
                57{" "}
                <span className="text-xs font-normal text-purple-600">mahasiswa</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chart kanan */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performaData}
                margin={{ top: 5, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="ujian"
                  tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Daftar 10 Ujian Terbaru",
                    position: "insideBottom",
                    offset: -12,
                    fontSize: 10,
                    fill: "#9CA3AF",
                  }}
                />
                <YAxis
                  domain={[20, 100]}
                  ticks={[20, 40, 60, 80, 100]}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Rata-rata Nilai",
                    angle: -90,
                    position: "insideLeft",
                    offset: 15,
                    fontSize: 10,
                    fill: "#9CA3AF",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "0.5px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value}`, "Nilai rata-rata"]}
                />
                <Line
                  type="linear"
                  dataKey="nilai"
                  stroke="#0D9488"
                  strokeWidth={2}
                  dot={<CustomDot />}
                  activeDot={{ r: 6, fill: "#0D9488" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-1 mt-1">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-xs">📈</span>
              Performa Mahasiswa meningkat sejak 5 ujian terakhir
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-xs">⚠️</span>
              Ujian memiliki tingkat kelulusan rendah
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}