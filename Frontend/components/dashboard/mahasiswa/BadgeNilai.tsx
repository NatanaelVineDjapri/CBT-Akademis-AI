"use client";

import { Calendar, Clock } from "lucide-react";
import type { NilaiDetailInfo, GradeSettingItem } from "@/types";

const GRADE_COLORS: Record<string, string> = {
  A: "var(--nilai-a)",
  B: "var(--nilai-b)",
  C: "var(--nilai-c)",
  D: "var(--nilai-d)",
  E: "var(--nilai-e)",
};

const DEFAULT_GRADES: GradeSettingItem[] = [
  { grade: "A", nilai_min: 90, nilai_max: 100 },
  { grade: "B", nilai_min: 80, nilai_max: 89 },
  { grade: "C", nilai_min: 70, nilai_max: 79 },
  { grade: "D", nilai_min: 60, nilai_max: 69 },
  { grade: "E", nilai_min: 0,  nilai_max: 59 },
];

function rangeLabel(item: GradeSettingItem) {
  if (item.nilai_min === 0) return `<${item.nilai_max + 1}`;
  if (item.nilai_max >= 100) return `${item.nilai_min}–100`;
  return `${item.nilai_min}–${item.nilai_max}`;
}

export default function BadgeNilai({ info }: { info: NilaiDetailInfo }) {
  const grades = (info.grade_setting?.length ?? 0) > 0
    ? [...info.grade_setting].sort((a, b) => b.nilai_min - a.nilai_min)
    : DEFAULT_GRADES;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">{info.nama_ujian}</h2>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={12} />
              {info.tanggal}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} />
              {info.waktu}
            </span>
          </div>
        </div>
        <div className="text-white text-sm font-semibold px-5 py-2 rounded-xl bg-[var(--color-primary)]">
          Nilai: {info.nilai}
        </div>
      </div>

      <div
        className="grid gap-2 mt-4"
        style={{ gridTemplateColumns: `repeat(${grades.length}, minmax(0, 1fr))` }}
      >
        {grades.map((g) => (
          <div
            key={g.grade}
            style={{
              background: GRADE_COLORS[g.grade] ?? "var(--color-primary)",
              // opacity: info.grade === g.grade ? 1 : 1,
            }}
            className="rounded-xl py-3 flex flex-col items-center justify-center transition-all"
          >
            <span className="text-lg font-bold text-white">{g.grade}</span>
            <span className="text-xs mt-1 text-white">{rangeLabel(g)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
