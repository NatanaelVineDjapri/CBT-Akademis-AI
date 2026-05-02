import { FileText } from "lucide-react";
import type { AdminUniversitasDashboard } from "@/types";

export default function UjianTerbaruCard({ data }: { data: AdminUniversitasDashboard['ujian_terbaru'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Ujian Terbaru</span>
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada ujian.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{u.nama}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.mata_kuliah} · {u.start_date}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{u.jam}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
