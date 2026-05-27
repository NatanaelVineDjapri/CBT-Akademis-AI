"use client";

import useSWR, { preload } from "swr";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";
import { getMyMataKuliah, getMyMataKuliahDetail } from "@/services/MataKuliahServices";
import { getBankSoalGlobal } from "@/services/BankSoalServices";
import SearchInput from "@/components/filtering/SearchInput";
import { toSlug } from "@/utils/slug";

export default function MataKuliahDetailPage() {
  const { matkul } = useParams<{ matkul: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: allMatkul } = useSWR(
    "/mata-kuliah/my/all",
    () => getMyMataKuliah({ per_page: 200 }),
    { revalidateOnFocus: false, revalidateIfStale: false }
  );

  const matkulId = allMatkul?.data.find(m => toSlug(m.nama) === matkul)?.id;

  const { data, isLoading } = useSWR(
    matkulId ? `/mata-kuliah/my/${matkulId}` : null,
    () => getMyMataKuliahDetail(matkulId!),
    { revalidateOnFocus: false }
  );

  const filtered = (data?.bab ?? []).filter((b) =>
    b.nama_bab.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm mb-3 transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          <ChevronLeft size={16} /> Kembali
        </button>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Mata Kuliah
        </h1>
        <p className="text-sm text-gray-500 mt-1">Detail informasi dan daftar bab</p>
      </div>

      {/* Info Card */}
      {isLoading || !matkulId ? (
        <div className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 h-24" />
      ) : data && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <BookOpen size={22} className="text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              {data.nama}
            </h2>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <GraduationCap size={14} /> Dosen Pengurus : {data.dosen}
            </span>
          </div>
        </div>
      )}

      {/* Bab List */}
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
            Daftar Bab
          </h2>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari bab..." />
        </div>

        <div className="p-5">
          {isLoading || !matkulId ? (
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
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">
              {search ? "Bab tidak ditemukan." : "Belum ada bab."}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((bab) => {
                const hasSoal = bab.jumlah_soal > 0;
                const inner = (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: hasSoal ? "var(--color-primary)" : "#d1d5db" }}
                      >
                        <Layers size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Bab {bab.urutan}</p>
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: hasSoal ? "var(--color-primary)" : "#9ca3af" }}
                        >
                          {bab.nama_bab}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">Bank Soal</p>
                        <p
                          className="text-sm font-bold"
                          style={{ color: hasSoal ? "var(--color-primary)" : "#9ca3af" }}
                        >
                          {bab.jumlah_soal}
                        </p>
                      </div>
                      <ChevronRight size={16} className={hasSoal ? "text-gray-300" : "text-gray-200"} />
                    </div>
                  </>
                );

                return hasSoal ? (
                  <Link
                    key={bab.id}
                    href={`/mahasiswa/mata-kuliah/${matkul}/${toSlug(bab.nama_bab)}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, white)" }}
                    onMouseEnter={() => matkulId && preload(
                      ["/bank-soal/global", matkulId, bab.id, ""],
                      () => getBankSoalGlobal({ mata_kuliah_id: matkulId, bab_id: bab.id })
                    )}
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
