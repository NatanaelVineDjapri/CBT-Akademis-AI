"use client";

import useSWR from "swr";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ChevronLeft, GraduationCap, Layers, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getMyMataKuliahDetail } from "@/services/MataKuliahServices";
import SearchInput from "@/components/filtering/SearchInput";

export default function MataKuliahDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useSWR(
    id ? `/mata-kuliah/my/${id}` : null,
    () => getMyMataKuliahDetail(id),
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
      {isLoading ? (
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
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Layers size={14} /> Total Bab : {data.total_bab} Bab
            </span>
          </div>
        </div>
      )}

      {/* Tabel Bab */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden px-3 pb-2">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold shrink-0" style={{ color: "var(--color-primary)" }}>
            Daftar Bab
          </h2>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari bab..." />
        </div>

        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-14" />
            <col />
            <col className="w-32" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-bold">#</th>
              <th className="text-left px-4 py-3 text-xs text-gray-400 font-bold">Nama Bab</th>
              <th className="text-center px-4 py-3 text-xs text-gray-400 font-bold">Jumlah Soal</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 animate-pulse">
                  <td className="px-4 py-4"><div className="h-3 w-6 bg-gray-100 rounded" /></td>
                  <td className="px-4 py-4"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-3 w-8 bg-gray-100 rounded mx-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">
                  {search ? "Bab tidak ditemukan." : "Belum ada bab."}
                </td>
              </tr>
            ) : (
              filtered.map((bab, i) => (
                <tr key={bab.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-gray-400">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/mahasiswa/mata-kuliah/${id}/${bab.id}`}
                      className="flex items-center justify-between group"
                    >
                      <span className="text-gray-700 font-medium group-hover:underline">{bab.nama_bab}</span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600">{bab.jumlah_soal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
