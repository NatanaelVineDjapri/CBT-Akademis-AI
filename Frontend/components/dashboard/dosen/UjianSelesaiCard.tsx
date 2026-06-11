"use client";

import Link from "next/link";
import { preload } from "swr";
import { CheckCircle, ClipboardList } from "lucide-react";
import type { DosenUjianItem } from "@/types";
import { getDetailUjianDosen } from "@/services/UjianServices";
import { getHasilUjianDosen } from "@/services/UjianServices";
import { calcPerPage } from "@/hooks/usePerPage";
import EmptyState from "@/components/EmptyState";

export default function UjianSelesaiCard({ data }: { data: DosenUjianItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle size={16} className="text-gray-500 shrink-0" />
          <span className="text-sm font-semibold truncate" style={{ color: "var(--color-primary)" }}>Ujian Selesai</span>
        </div>
        {data.length > 0 && (
          <Link
            href="/dosen/hasil-ujian"
            className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80 shrink-0 whitespace-nowrap"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
            onMouseEnter={() => {
              const pp = calcPerPage(53, 1, 395);
              preload(["/ujian/dosen/hasil", "", 1, pp, "tanggal", "desc"],
                ([, s, p, perPg]: [string, string, number, number, string, string]) =>
                  getHasilUjianDosen({ search: s, page: p, per_page: perPg, sort_by: "tanggal", sort_dir: "desc" }));
            }}
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center"><EmptyState flat size={56} message="Belum ada ujian selesai." /></div>
      ) : (
        <div className="flex flex-col flex-1 gap-3">
          {data.map((ujian) => (
            <div
              key={ujian.id}
              className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <ClipboardList size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{ujian.nama}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ujian.mata_kuliah} · {ujian.end_date}
                  </p>
                </div>
              </div>
              <Link
                href={`/dosen/hasil-ujian/${ujian.id}`}
                className="text-xs text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
                onMouseEnter={() => preload(`/ujian/dosen/hasil/${ujian.id}`, () => getDetailUjianDosen(ujian.id))}
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
