"use client";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { mk: "Matema...", nilai: 78.69 },
  { mk: "Fisika", nilai: 61.14 },
  { mk: "Biologi", nilai: 82.33 },
  { mk: "Kimia", nilai: 72.87 },
];

export default function RataRataNilaiCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={15} className="text-teal-600" />
        <span className="text-sm font-medium text-gray-800">Rata – rata Nilai per Mata Kuliah</span>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col divide-y divide-gray-50">
          {data.map((d) => (
            <div key={d.mk} className="flex items-center justify-between py-2">
              <span className="text-xs font-medium text-gray-800">{d.mk.replace("...", "")}</span>
              <span className="text-xs font-medium text-teal-600">{d.nilai}%</span>
            </div>
          ))}
          <div className="flex items-start gap-1 pt-2">
            <CheckCircle size={11} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-green-600">MK Biologi memiliki rata-rata cukup baik</span>
          </div>
          <div className="flex items-start gap-1 pt-1">
            <AlertTriangle size={11} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-amber-600">MK Fisika memiliki rata-rata dibawah KKM</span>
          </div>
        </div>
        <div className="w-32 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <XAxis dataKey="mk" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis domain={[20, 100]} ticks={[20,40,60,80,100]} tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Bar dataKey="nilai" fill="#0d9488" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}