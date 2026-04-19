"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { BookOpen, UserCircle, ChevronRight, Layers } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import { getBankSoalGlobalDetail } from "@/services/BankSoalServices";

interface Props {
  params: Promise<{ slug: string }>;
}

function extractId(slug: string): number {
  const parts = slug.split("-");
  return Number(parts[parts.length - 1]);
}

export default function BankSoalGlobalDetailPage({ params }: Props) {
  const { slug } = use(params);
  const id = extractId(slug);

  const { data, isLoading } = useSWR(
    ["/bank-soal/global", id],
    () => getBankSoalGlobalDetail(id),
    { revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const babs = data?.babs ?? [];
  const secondary = bankSoal?.creator?.universitas?.nama ?? "";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <Breadcrumb overrides={bankSoal ? { [slug]: bankSoal.nama } : undefined} />
      </div>

      {/* Bank Soal Info Header */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-3 shrink-0"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-white/30" />
              <div className="h-7 rounded-full bg-white/30 w-64" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/30" />
              <div className="h-3 rounded bg-white/30 w-48" />
            </div>
            <div className="h-3 rounded bg-white/30 w-full" />
          </div>
        ) : (
          <>
            {/* Title pill */}
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-white shrink-0" />
              <div className="flex items-center rounded-full bg-white px-3 py-1 min-w-0">
                <span className="text-sm font-semibold truncate" style={{ color: "var(--color-primary)" }}>
                  {bankSoal?.nama ?? "-"}
                </span>
              </div>
            </div>

            {/* Univ + creator */}
            <div className="flex flex-col gap-1.5">
              {secondary && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-white leading-none">
                      {secondary.split(" ").map((w: string) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium truncate">{secondary}</p>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <UserCircle size={20} className="text-white/60 shrink-0" />
                <p className="text-xs text-white/70">
                  <span className="text-white font-medium">{bankSoal?.creator?.nama ?? "-"}</span>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20" />

            {/* Deskripsi */}
            <p className="text-xs text-white/80 leading-relaxed">
              {bankSoal?.deskripsi || "Tidak ada deskripsi."}
            </p>
          </>
        )}
      </div>

      {/* Bab List */}
      <div className="bg-white rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
            Daftar Bab
          </h2>
          {bankSoal?.mata_kuliah && (
            <p className="text-xs text-gray-400 mt-0.5">{bankSoal.mata_kuliah.nama}</p>
          )}
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, white)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200" />
                    <div className="h-4 rounded bg-gray-200 w-40" />
                  </div>
                  <div className="h-4 rounded bg-gray-200 w-16" />
                </div>
              ))}
            </div>
          ) : babs.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">Tidak ada bab tersedia.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {babs.map((bab) => {
                const hassoal = bab.soal_count > 0;
                const inner = (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: hassoal ? "var(--color-primary)" : "#d1d5db" }}
                      >
                        <Layers size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Bab {bab.urutan}</p>
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: hassoal ? "var(--color-primary)" : "#9ca3af" }}
                        >
                          {bab.nama_bab}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">Soal</p>
                        <p
                          className="text-sm font-bold"
                          style={{ color: hassoal ? "var(--color-primary)" : "#9ca3af" }}
                        >
                          {bab.soal_count}
                        </p>
                      </div>
                      <ChevronRight size={16} className={hassoal ? "text-gray-300" : "text-gray-200"} />
                    </div>
                  </>
                );

                return hassoal ? (
                  <Link
                    key={bab.id}
                    href={`/dosen/bank-soal/global/${slug}/${bab.id}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, white)" }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div
                    key={bab.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl cursor-not-allowed opacity-60"
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 4%, white)" }}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
