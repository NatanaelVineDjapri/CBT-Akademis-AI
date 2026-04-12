"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

const data = [
  { name: "Matematika", value: 20, color: "#1d9e75" },
  { name: "Fisika", value: 30, color: "#378add" },
  { name: "Mandarin", value: 15, color: "#f59e0b" },
  { name: "PPKn", value: 25, color: "#f97316" },
  { name: "Biologi", value: 10, color: "#a78bfa" },
];

export default function GrafikPelanggaranCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-800">Grafik Tingkat Pelanggaran pada setiap Mata Kuliah</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={70} strokeWidth={2} stroke="#fff">
                {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-gray-600">{d.name}</span>
            </div>
          ))}
          <div className="flex items-start gap-1 mt-2">
            <AlertTriangle size={11} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-amber-600">Mata Kuliah Fisika memiliki total pelanggaran paling tinggi</span>
          </div>
        </div>
      </div>
    </div>
  );
}