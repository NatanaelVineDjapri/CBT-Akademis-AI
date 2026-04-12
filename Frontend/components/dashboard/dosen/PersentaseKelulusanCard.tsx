"use client";
import { CheckCircle, AlertTriangle } from "lucide-react";

const data = [
  { nama: "Kimia A", tanggal: "17 Maret 2026", jumlah: 30 },
  { nama: "Fisika A", tanggal: "14 Maret 2026", jumlah: 24 },
  { nama: "Mandarin C", tanggal: "11 Maret 2026", jumlah: 18 },
  { nama: "PPKn B", tanggal: "10 Maret 2026", jumlah: 42 },
];

export default function PersentaseKelulusanCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={15} className="text-teal-600" />
        <span className="text-sm font-medium text-gray-800">Persentase Kelulusan</span>
      </div>
      <div className="flex flex-col divide-y divide-gray-50">
        {data.map((d) => (
          <div key={d.nama} className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-gray-800">{d.nama}</p>
              <p className="text-xs text-gray-400">{d.tanggal}</p>
            </div>
            <span className="text-xs font-medium bg-teal-600 text-white px-3 py-1 rounded-lg">
              {d.jumlah} Pelanggaran
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2">
        <AlertTriangle size={12} className="text-amber-500" />
        <span className="text-xs text-amber-600">Ujian PPKn B memiliki total pelanggaran tinggi</span>
      </div>
      <button className="mt-3 w-full bg-teal-600 text-white text-xs font-medium py-2 rounded-xl hover:bg-teal-700 transition-colors">
        Lihat Semua
      </button>
    </div>
  );
}