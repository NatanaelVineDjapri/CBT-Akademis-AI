"use client";

import useSWR from "swr";
import { TriangleAlert } from "lucide-react";
import { getPengumuman, type Pengumuman } from "@/services/PengumumanService";

export default function PengumumanCard() {
  const { data: response, isLoading } = useSWR(
    ["/pengumuman", "created_at", "desc"],
    () => getPengumuman({ sort_by: "created_at", sort_dir: "desc", per_page: 20 }),
    { revalidateOnFocus: false }
  );
  const data = response?.data;

  if (isLoading || !data) return null;
  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {data.map((item: Pengumuman) => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 items-start">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <TriangleAlert size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 mb-1">{item.judul}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{item.isi}</p>
            <p className="text-[10px] text-gray-400 mt-1.5">
              {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
