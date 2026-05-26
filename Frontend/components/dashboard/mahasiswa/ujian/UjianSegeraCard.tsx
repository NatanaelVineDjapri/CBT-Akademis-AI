import Link from "next/link";
import { preload } from "swr";
import { Bell, Calendar, Clock } from "lucide-react";
import type { DashboardUjianItem } from "@/types";
import { formatDate, formatTime } from "@/utils/format";
import { getMyUjian } from "@/services/UjianServices";
import { calcPerPage } from "@/hooks/usePerPage";

export default function UjianSegeraCard({
  data,
}: {
  data: DashboardUjianItem[];
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
          onMouseEnter={() => {
            const pp = calcPerPage(245, 4, 255);
            preload(["/ujian/my", "sedang_berlangsung", "", "", 1, pp],
              ([, st, s, sd, p, perPg]: [string, string, string, string, number, number]) =>
                getMyUjian({ status: st, search: s, sort_dir: (sd || undefined) as "asc" | "desc" | undefined, page: p, per_page: perPg }));
          }}
        >
          Lihat Semua
        </Link>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400">
          Tidak ada ujian yang sedang berlangsung.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <div key={item.peserta_ujian_id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Clock size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.nama}
                </p>
                <div className="flex gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={10} /> {formatDate(item.start_date)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={10} /> {formatTime(item.start_date)} –{" "}
                    {formatTime(item.end_date)}
                  </span>
                </div>
              </div>
              <Link
                href={`/mahasiswa/ujian?tab=berlangsung`}
                className="text-white text-xs font-medium px-4 py-1.5 rounded-lg shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Mulai
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
