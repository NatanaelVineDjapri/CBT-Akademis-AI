import Link from "next/link";
import { Bell, Calendar, Clock } from "lucide-react";
import type { DashboardUjianItem } from "@/services/DashboardServices";
import { formatDate, formatTime } from "@/utils/format";

export default function UjianSegeraCard({
  data,
}: {
  data: DashboardUjianItem | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={15} style={{ color: "var(--color-primary)" }} />
          <span className="text-sm font-semibold text-gray-800">
            Ujian Sedang Berlangsung
          </span>
        </div>
        <Link
          href="/mahasiswa/ujian?tab=berlangsung"
          className="text-xs rounded-lg px-3 py-1 border transition-colors"
          style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
        >
          Lihat Semua
        </Link>
      </div>
      {data ? (
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Clock size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {data.nama}
            </p>
            <div className="flex gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={10} /> {formatDate(data.start_date)}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={10} /> {formatTime(data.start_date)} –{" "}
                {formatTime(data.end_date)}
              </span>
            </div>
          </div>
          <button
            className="text-white text-xs font-medium px-4 py-1.5 rounded-lg shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Mulai
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          Tidak ada ujian yang sedang berlangsung.
        </p>
      )}
    </div>
  );
}
