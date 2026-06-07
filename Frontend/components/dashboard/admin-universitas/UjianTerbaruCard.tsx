import Link from "next/link";
import { ClipboardList, Calendar, Clock } from "lucide-react";
import type { AdminUniversitasDashboard } from "@/types";

export default function UjianTerbaruCard({ data }: { data: AdminUniversitasDashboard['ujian_terbaru'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Ujian PMB Terbaru</span>
        </div>
        {data.length > 0 && (
          <Link
            href="/admin-universitas/ujian-pmb"
            className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada ujian.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((u) => (
            <div key={u.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  <ClipboardList size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.nama}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {u.start_date && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} /> {u.start_date}
                      </span>
                    )}
                    {u.jam && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={11} /> {u.jam}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href="/admin-universitas/ujian-pmb"
                className="text-xs text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
