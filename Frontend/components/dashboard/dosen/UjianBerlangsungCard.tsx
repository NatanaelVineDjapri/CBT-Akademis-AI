"use client";

import { Clock } from "lucide-react";

const ujianBerlangsung = [
  { id: 1, nama: "Matematika A", tanggal: "21 Maret 2026" },
];

export default function UjianBerlangsungCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">
          Ujian yang sedang Berlangsung
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {ujianBerlangsung.map((ujian) => (
          <div
            key={ujian.id}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{ujian.nama}</p>
              <p className="text-xs text-gray-400 mt-0.5">{ujian.tanggal}</p>
            </div>
            <button className="text-xs bg-teal-600 text-white rounded-lg px-3 py-1.5 hover:bg-teal-700 transition-colors">
              Monitor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
