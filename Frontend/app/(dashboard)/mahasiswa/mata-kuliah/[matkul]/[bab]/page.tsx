"use client";

import { use, useState } from "react";
import useSWR, { preload } from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import SearchInput from "@/components/filtering/SearchInput";
import { getMyMataKuliah, getMyMataKuliahDetail } from "@/services/MataKuliahServices";
import { getBankSoalGlobal, getBankSoalSoal } from "@/services/BankSoalServices";
import { toSlug } from "@/utils/slug";

interface Props {
  params: Promise<{ matkul: string; bab: string }>;
}

export default function MahasiswaBabBankSoalPage({ params }: Props) {
  const { matkul, bab } = use(params);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data: allMatkul } = useSWR(
    "/mata-kuliah/my/all",
    () => getMyMataKuliah({ per_page: 200 }),
    { revalidateOnFocus: false, revalidateIfStale: false }
  );

  const matkulId = allMatkul?.data.find(m => toSlug(m.nama) === matkul)?.id;

  const { data: matkulDetail } = useSWR(
    matkulId ? `/mata-kuliah/my/${matkulId}` : null,
    () => getMyMataKuliahDetail(matkulId!),
    { revalidateOnFocus: false }
  );

  const babItem = matkulDetail?.bab.find(b => toSlug(b.nama_bab) === bab);
  const babId = babItem?.id;

  const { data, isLoading } = useSWR(
    matkulId && babId ? ["/bank-soal/global", matkulId, babId, debouncedSearch] : null,
    () => getBankSoalGlobal({ mata_kuliah_id: matkulId, bab_id: babId, search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bankSoalList = data?.data ?? [];

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
          {babItem?.nama_bab ?? "Daftar Bank Soal"}
        </h1>
        {matkulDetail && (
          <p className="text-sm text-gray-500 mt-1">{matkulDetail.nama}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Daftar Bank Soal</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pilih bank soal untuk mulai belajar.</p>
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari bank soal..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nama Bank Soal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Jumlah Soal</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {isLoading || !babId ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-5 py-3"><div className="h-3 w-6 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-100 rounded" /></td>
                    <td />
                  </tr>
                ))
              ) : bankSoalList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">
                    {search ? "Bank soal tidak ditemukan." : "Belum ada bank soal untuk bab ini."}
                  </td>
                </tr>
              ) : (
                bankSoalList.map((bs, idx) => (
                  <tr
                    key={bs.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    onMouseEnter={() => preload(
                      ["/bank-soal", String(bs.id), "soal", ""],
                      () => getBankSoalSoal(bs.id, {})
                    )}
                  >
                    <td className="px-5 py-3 text-xs text-gray-400">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/mahasiswa/mata-kuliah/${matkul}/${bab}/${toSlug(bs.nama)}`}
                        className="flex items-center gap-2 group"
                      >
                        <BookOpen size={13} className="text-gray-300 shrink-0" />
                        <span className="font-medium group-hover:underline" style={{ color: "var(--color-primary)" }}>{bs.nama}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{bs.soal_count ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight size={14} className="text-gray-300" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
