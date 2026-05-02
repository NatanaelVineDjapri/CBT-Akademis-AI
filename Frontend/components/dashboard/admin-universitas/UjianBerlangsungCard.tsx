import Link from "next/link";
import { Clock } from "lucide-react";
import type { AdminUniversitasDashboard } from "@/types";

export default function UjianBerlangsungCard({ data }: { data: AdminUniversitasDashboard['ujian_berlangsung'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Ujian Sedang Berlangsung</span>
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Tidak ada ujian yang sedang berlangsung.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">{u.nama}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.mata_kuliah} · {u.jam}</p>
                {u.jumlah_peserta !== undefined && (
                  <p className="text-xs text-gray-400">{u.jumlah_peserta} peserta</p>
                )}
              </div>
              <Link
                href="/admin-universitas/ujian"
                className="text-xs text-white rounded-lg px-3 py-1.5 whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Monitor
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
