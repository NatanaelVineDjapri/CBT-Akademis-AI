"use client";

import { ClipboardList, Calendar, Clock } from "lucide-react";

const ujianTerbaruData = [
  {
    id: 1,
    nama: "Matematika A",
    tanggal: "21 Maret 2026",
    jam: "10:00 – 12:00",
  },
  {
    id: 2,
    nama: "Bahasa Indonesia B",
    tanggal: "20 Maret 2026",
    jam: "13:00 – 15:00",
  },
  {
    id: 3,
    nama: "Bahasa Indonesia B",
    tanggal: "20 Maret 2026",
    jam: "13:00 – 15:00",
  },
];

export default function UjianTerbaruCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">
            Ujian Terbaru
          </span>
        </div>
        <button className="text-xs text-teal-600 border border-teal-600 rounded-lg px-3 py-1 hover:bg-teal-50 transition-colors">
          Lihat Semua
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {ujianTerbaruData.map((ujian) => (
          <div
            key={ujian.id}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                <ClipboardList size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{ujian.nama}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={11} />
                    {ujian.tanggal}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    {ujian.jam}
                  </span>
                </div>
              </div>
            </div>
            <button className="text-xs bg-teal-600 text-white rounded-lg px-3 py-1.5 hover:bg-teal-700 transition-colors whitespace-nowrap">
              Lihat Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
