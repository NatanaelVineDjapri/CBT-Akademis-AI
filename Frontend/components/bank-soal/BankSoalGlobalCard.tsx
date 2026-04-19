"use client";

import { BookOpen, UserCircle } from "lucide-react";
import Link from "next/link";
import { preload } from "swr";
import { getBankSoalGlobalDetail } from "@/services/BankSoalServices";
import type { BankSoalItem } from "@/types";

interface Props {
  item: BankSoalItem;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function BankSoalGlobalCard({ item }: Props) {
  const babs = item.mata_kuliah?.bab ?? [];
  const primary = item.nama;
  const secondary = item.creator?.universitas?.nama ?? "";
  const slug = `${toSlug(item.nama)}-${item.id}`;

  return (
    <Link
      href={`/dosen/bank-soal/global/${slug}`}
      onMouseEnter={() => preload(["/bank-soal/global", item.id], () => getBankSoalGlobalDetail(item.id))}
      className="block rounded-2xl p-4 flex flex-col gap-3 hover:opacity-90 transition-opacity"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* Header: icon + pill */}
      <div className="flex items-center gap-2">
        <BookOpen size={20} className="text-white shrink-0" />
        <div className="flex items-center rounded-full bg-white px-3 py-1 min-w-0">
          <span className="text-sm font-medium truncate" style={{ color: "var(--color-primary)" }}>
            {primary}
          </span>
        </div>
      </div>

      {/* Universitas + Created by */}
      <div className="flex flex-col gap-1.5">
        {secondary && (
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-white leading-none">
                {secondary.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-white font-medium truncate">{secondary}</p>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <UserCircle size={20} className="text-white/60 shrink-0" />
          <p className="text-xs text-white/70">
            <span className="text-white font-medium">{item.creator?.nama ?? "-"}</span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20" />

      {/* Deskripsi */}
      <p className="text-xs text-white/80 leading-relaxed line-clamp-2 min-h-[2.5rem]">
        {item.deskripsi || "Tidak ada deskripsi."}
      </p>

      {/* Daftar Bab + Jumlah Soal */}
      <div className="bg-white rounded-xl px-3 py-2 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] uppercase tracking-wide text-gray-400">Daftar Bab</span>
          <span className="text-xs font-medium truncate" style={{ color: "var(--color-primary)" }}>
            {babs.length > 0 ? babs.map((b) => b.nama_bab).join(", ") : "-"}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 items-end shrink-0">
          <span className="text-[10px] uppercase tracking-wide text-gray-400">Jumlah Soal</span>
          <span className="text-xs font-medium" style={{ color: "var(--color-primary)" }}>{item.soal_count ?? 0}</span>
        </div>
      </div>
    </Link>
  );
}
