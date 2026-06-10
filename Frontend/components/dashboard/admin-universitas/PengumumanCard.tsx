import Link from "next/link";
import { Bell } from "lucide-react";
import type { AdminUniversitasDashboard } from "@/types";

export default function PengumumanCard({ data }: { data: AdminUniversitasDashboard['pengumuman'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Bell size={16} className="text-gray-500 shrink-0" />
          <span className="text-sm font-semibold truncate" style={{ color: "var(--color-primary)" }}>Pengumuman Aktif</span>
        </div>
        <Link
          href="/admin-universitas/pengumuman"
          className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80 shrink-0 whitespace-nowrap"
          style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
        >
          Kelola
        </Link>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400 flex-1">Belum ada pengumuman aktif.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((p) => (
            <div key={p.id}
              className="p-3 rounded-xl hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 6%, white)" }}>
              <p className="text-sm font-semibold text-gray-800">{p.judul}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.isi}</p>
              {p.expired_at && (
                <p className="text-xs text-gray-400 mt-1">Berakhir: {p.expired_at}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
