"use client";

import { Calendar, Clock } from "lucide-react";

const grades = [
  { label: "A", range: "90–100", bg: "var(--nilai-a)" },
  { label: "B", range: "80–89", bg: "var(--nilai-b)" },
  { label: "C", range: "70–79", bg: "var(--nilai-c)" },
  { label: "D", range: "60–69", bg: "var(--nilai-d)" },
  { label: "E", range: "<60", bg: "var(--nilai-e)" },
];

function getGrade(nilai: number) {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 70) return "C";
  if (nilai >= 60) return "D";
  return "E";
}

export default function NilaiDetailCard() {
  // 
  const data = {
    matkul: "Kimia A",
    nilai: 95,
    tanggal: "17 Maret 2026",
    waktu: "08:00 – 10:00",
  };

  const currentGrade = getGrade(data.nilai);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
      
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            {data.matkul}
          </h2>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={12} />
              {data.tanggal}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} />
              {data.waktu}
            </span>
          </div>
        </div>

        <div className="text-white text-sm font-semibold px-5 py-2 rounded-xl bg-[var(--color-primary)]">
          Nilai: {data.nilai}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {grades.map((g) => (
          <div
            key={g.label}
            style={{
              background: g.bg,
            }}
            className="rounded-xl py-3 flex flex-col items-center justify-center transition-all"
          >
            <span className="text-lg font-bold text-white">
              {g.label}
            </span>
            <span className="text-xs mt-1 text-white">
              {g.range}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}