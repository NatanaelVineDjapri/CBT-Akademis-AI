"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const dates = [
  [null,null,null,null,null,null,1],
  [2,3,4,5,6,7,8],
  [9,10,11,12,13,14,15],
  [16,17,18,19,20,21,22],
  [23,24,25,26,27,28,29],
  [30,31,null,null,null,null,null],
];
const today = 21;

export default function JadwalCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-800">Jadwal</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <ChevronLeft size={13} />
            </button>
            <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <ChevronRight size={13} />
            </button>
          </div>
          <select className="text-xs font-medium text-gray-800 border border-gray-200 rounded-lg px-2 py-1 bg-white">
            <option>Maret 2026</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
        {dates.flat().map((d, i) => (
          <div key={i} className={`text-center text-xs py-1.5 rounded-md ${!d ? "text-transparent" : d === today ? "text-white font-medium" : "text-gray-600"}`} style={d === today ? { backgroundColor: "var(--color-primary)" } : {}}>
            {d ?? "."}
          </div>
        ))}
      </div>
    </div>
  );
}