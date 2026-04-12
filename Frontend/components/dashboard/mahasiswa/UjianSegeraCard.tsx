import { Bell, Calendar, Clock } from "lucide-react";

export default function UjianSegeraCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={15} className="text-teal-600" />
        <span className="text-sm font-semibold text-gray-800">Ujian Segera Berlangsung</span>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
        <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Matematika A</p>
          <div className="flex gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={10} /> 20 Maret 2026
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={10} /> 08:00 – 10:00
            </span>
          </div>
        </div>
        <button className="bg-gray-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
          Mulai
        </button>
      </div>
    </div>
  );
}