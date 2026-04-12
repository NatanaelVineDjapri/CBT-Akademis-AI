import { CalendarDays, Calendar, Clock } from "lucide-react";

const data = [
  { nama: "Matematika B", tanggal: "21 Maret 2026", jam: "08:00 – 10:00" },
  { nama: "Bahasa Indonesia A", tanggal: "22 Maret 2026", jam: "08:00 – 10:00" },
  { nama: "Matematika C", tanggal: "23 Maret 2026", jam: "08:00 – 10:00" },
];

export default function UjianAkanDatangCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-teal-600" />
          <span className="text-sm font-semibold text-gray-800">Ujian Akan Datang</span>
        </div>
        <button className="text-xs text-teal-600 border border-teal-600 rounded-lg px-3 py-1 hover:bg-teal-50 transition-colors">
          Lihat Semua
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.nama} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{d.nama}</p>
              <div className="flex gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={10} /> {d.tanggal}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={10} /> {d.jam}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}