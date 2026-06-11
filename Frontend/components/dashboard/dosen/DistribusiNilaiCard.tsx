"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { GraduationCap } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const GRADE_COLORS: Record<string, string> = {
  A: "var(--nilai-a)",
  B: "var(--nilai-b)",
  C: "var(--nilai-c)",
  D: "var(--nilai-d)",
  E: "var(--nilai-e)",
};

interface Props {
  data: { grade: string; jumlah: number }[];
}

export default function DistribusiNilaiCard({ data }: Props) {
  const total = data.reduce((s, d) => s + d.jumlah, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap size={15} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-800">Distribusi Nilai</span>
      </div>

      {total === 0 ? (
        <div className="flex-1 min-h-[180px] flex items-center justify-center"><EmptyState flat size={64} message="Belum ada data nilai." /></div>
      ) : (
        <>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="grade" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 600 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.4 / 5) * 5]}
                  tickCount={10} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0];
                    const pct = total > 0 ? Math.round(((d.value as number) / total) * 100) : 0;
                    return (
                      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-md text-xs">
                        <p className="font-semibold text-gray-800">Grade {d.payload.grade}</p>
                        <p className="text-gray-500">{d.value} mahasiswa · {pct}%</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] ?? "var(--color-primary)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-3 mt-3 flex-wrap">
            {data.map((d) => (
              <div key={d.grade} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: GRADE_COLORS[d.grade] ?? "var(--color-primary)" }} />
                <span className="text-xs text-gray-500">
                  {d.grade}: <span className="font-semibold text-gray-700">{d.jumlah}</span>
                </span>
              </div>
            ))}
            <span className="text-xs text-gray-400 ml-auto">{total} total</span>
          </div>
        </>
      )}
    </div>
  );
}
