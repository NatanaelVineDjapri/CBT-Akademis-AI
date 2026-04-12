"use client";

import { CheckCircle } from "lucide-react";

const ujianSelesai = [
  { id: 1, nama: "Kimia A", tanggal: "17 Maret 2026" },
  { id: 2, nama: "Fisika A", tanggal: "14 Maret 2026" },
  { id: 3, nama: "Mandarin C", tanggal: "11 Maret 2026" },
  { id: 4, nama: "PPKn B", tanggal: "10 Maret 2026" },
];

export default function UjianSelesaiCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Ujian Selesai</span>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {ujianSelesai.map((ujian) => (
          <div
            key={ujian.id}
            className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{ujian.nama}</p>
              <p className="text-xs text-gray-400 mt-0.5">{ujian.tanggal}</p>
            </div>
            <button className="text-xs bg-teal-600 text-white rounded-lg px-3 py-1.5 hover:bg-teal-700 transition-colors">
              Nilai
            </button>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full text-xs text-teal-600 border border-teal-600 rounded-lg px-3 py-2 hover:bg-teal-50 transition-colors">
        Lihat Semua
      </button>
    </div>
  );
}
