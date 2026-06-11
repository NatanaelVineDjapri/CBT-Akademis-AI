import Link from "next/link";
import { CheckCircle, ClipboardList } from "lucide-react";
import type { AdminUniversitasDashboard } from "@/types";
import { toSlug } from "@/utils/slug";
import EmptyState from "@/components/EmptyState";

export default function UjianSelesaiCard({ data }: { data: AdminUniversitasDashboard['ujian_selesai'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle size={16} className="text-gray-500 shrink-0" />
          <span className="text-sm font-semibold truncate" style={{ color: "var(--color-primary)" }}>Ujian PMB Selesai</span>
        </div>
        {data.length > 0 && (
          <Link
            href="/admin-universitas/hasil-ujian-pmb"
            className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80 shrink-0 whitespace-nowrap"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center"><EmptyState flat size={56} message="Belum ada ujian selesai." /></div>
      ) : (
        <div className="flex flex-col flex-1 gap-3">
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
                  <p className="text-xs text-gray-400 mt-0.5">{u.end_date}</p>
                </div>
              </div>
              <Link
                href={`/admin-universitas/hasil-ujian-pmb/${toSlug(u.nama)}`}
                className="text-xs text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Nilai
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
