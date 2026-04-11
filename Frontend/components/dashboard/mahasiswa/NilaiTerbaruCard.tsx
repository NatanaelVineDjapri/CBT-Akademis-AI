import { GraduationCap } from "lucide-react";

const data = [
  { nama: "Kimia A", tanggal: "17 Maret 2026", nilai: 85 },
  { nama: "PPKn A", tanggal: "16 Maret 2026", nilai: 96 },
  { nama: "Fisika A", tanggal: "15 Maret 2026", nilai: 75 },
  { nama: "Biologi A", tanggal: "14 Maret 2026", nilai: 85 },
];

export default function NilaiTerbaruCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap size={15} className="text-teal-600" />
        <span className="text-sm font-semibold text-gray-800">Nilai Terbaru</span>
      </div>
      <div className="flex flex-col divide-y divide-gray-50">
        {data.map((d) => (
          <div key={d.nama} className="py-3 first:pt-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-800">{d.nama}</span>
              <span className="text-sm font-semibold text-purple-600">{d.nilai}</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{d.tanggal}</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-800 rounded-full" style={{ width: `${d.nilai}%` }} />
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full bg-teal-600 text-white text-xs font-medium py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
        Lihat Semua
      </button>
    </div>
  );
}