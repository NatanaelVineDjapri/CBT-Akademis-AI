"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";
import { BarChart2, TrendingUp, TrendingDown } from "lucide-react";
import { getDosenPerforma } from "@/services/DashboardServices";

const KKM = 60;

const CustomBar = (props: any) => {
  const { x, y, width, height, nilai } = props;
  const fill = nilai >= KKM ? "var(--color-primary)" : "var(--color-danger)";
  return <rect x={x} y={y} width={Math.max(width, 0)} height={Math.max(height, 0)} fill={fill} rx={4} />;
};

export default function RataRataNilaiCard() {
  const { data = [] } = useSWR("/dashboard/dosen/performa", getDosenPerforma, {
    revalidateOnFocus: false,
  });

  const chartData = data.map((d) => ({
    mk: d.matkul_nama.length > 9 ? d.matkul_nama.slice(0, 9) + "…" : d.matkul_nama,
    nilai: d.rata_rata_nilai,
    fullNama: d.matkul_nama,
  }));

  const best  = data.length ? data.reduce((a, b) => a.rata_rata_nilai >= b.rata_rata_nilai ? a : b) : null;
  const worst = data.length ? data.reduce((a, b) => a.rata_rata_nilai <= b.rata_rata_nilai ? a : b) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={15} style={{ color: "var(--color-primary)" }} />
        <span className="text-sm font-semibold text-gray-800">Rata-rata Nilai per Mata Kuliah</span>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada data nilai.</p>
      ) : (
        <>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="mk"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-md text-xs">
                        <p className="font-semibold text-gray-800 mb-0.5">{payload[0].payload.fullNama}</p>
                        <p style={{ color: "var(--color-primary)" }}>Rata-rata: <span className="font-bold">{payload[0].value}</span></p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine y={KKM} stroke="var(--color-warning)" strokeDasharray="4 3" strokeWidth={1.5} />
                <Bar dataKey="nilai" barSize={20} shape={<CustomBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-1.5 mb-3 -mt-1">
            <div className="w-5 border-t-2 border-dashed border-amber-400" />
            <span className="text-xs text-gray-400">KKM {KKM}</span>
            <div className="flex items-center gap-1 ml-3">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--color-primary)" }} />
              <span className="text-xs text-gray-400">Di atas KKM</span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--color-danger)" }} />
              <span className="text-xs text-gray-400">Di bawah KKM</span>
            </div>
          </div>

          {data.length > 1 && best && worst && best.matkul_id !== worst.matkul_id && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: "var(--color-primary-light)" }}>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp size={11} style={{ color: "var(--color-primary)" }} />
                  <span className="text-xs text-gray-500">Tertinggi</span>
                </div>
                <p className="text-xs font-semibold text-gray-800 truncate">{best.matkul_nama}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--color-primary)" }}>{best.rata_rata_nilai}</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: "var(--color-danger-light)" }}>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown size={11} style={{ color: "var(--color-danger)" }} />
                  <span className="text-xs text-gray-500">Terendah</span>
                </div>
                <p className="text-xs font-semibold text-gray-800 truncate">{worst.matkul_nama}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--color-danger)" }}>{worst.rata_rata_nilai}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
