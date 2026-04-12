"use client";

import { FileText } from "lucide-react";

const bankSoalData = [
  { id: 1, nama: "Fisika", jumlahSoal: 50, status: "Draft" },
  { id: 2, nama: "Bahasa Indonesia", jumlahSoal: 50, status: "Publik" },
];

export default function BankSoalCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">
            Bank Soal Terbaru
          </span>
        </div>
        <button className="text-xs text-teal-600 border border-teal-600 rounded-lg px-3 py-1 hover:bg-teal-50 transition-colors">
          Lihat Semua
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {bankSoalData.map((soal) => (
          <div
            key={soal.id}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                <FileText size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{soal.nama}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{soal.jumlahSoal} soal</span>
                  <StatusBadge status={soal.status} />
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

function StatusBadge({ status }: { status: string }) {
  const isDraft = status === "Draft";
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-md font-medium ${
        isDraft
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      Status {status}
    </span>
  );
}