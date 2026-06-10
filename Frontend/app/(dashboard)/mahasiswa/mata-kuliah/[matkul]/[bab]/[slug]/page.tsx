"use client";

import { use, useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import Pagination from "@/components/filtering/Pagination";
import { getMyMataKuliah, getMyMataKuliahDetail } from "@/services/MataKuliahServices";
import { getBankSoalGlobal, getBankSoalSoal } from "@/services/BankSoalServices";
import type { SoalSortBy, SoalSortDir } from "@/services/BankSoalServices";
import { toSlug } from "@/utils/slug";

interface Props {
  params: Promise<{ matkul: string; bab: string; slug: string }>;
}

export default function MahasiswaBankSoalSoalPage({ params }: Props) {
  const { matkul, bab, slug } = use(params);
  const router = useRouter();
  const perPage = usePerPage(80, 1, 280);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SoalSortBy>("deskripsi");
  const [sortDir, setSortDir] = useState<SoalSortDir>("asc");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir]);

  const handleSort = (col: SoalSortBy) => {
    const newDir: SoalSortDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    setSortBy(col);
    setSortDir(newDir);
  };

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

  const babId = matkulDetail?.bab.find(b => toSlug(b.nama_bab) === bab)?.id;

  const { data: globalData } = useSWR(
    matkulId && babId ? ["/bank-soal/global", matkulId, babId, ""] : null,
    () => getBankSoalGlobal({ mata_kuliah_id: matkulId, bab_id: babId }),
    { revalidateOnFocus: false }
  );

  const bankSoalId = globalData?.data.find(item => toSlug(item.nama) === slug)?.id;

  const { data, isLoading } = useSWR(
    bankSoalId ? ["/bank-soal", String(bankSoalId), "soal", page, perPage, sortBy, sortDir, debouncedSearch] : null,
    () => getBankSoalSoal(bankSoalId!, { search: debouncedSearch, page, per_page: perPage, sort_by: sortBy, sort_dir: sortDir }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const bankSoal = data?.bank_soal;
  const soalList = data?.data ?? [];
  const meta = data?.meta ?? null;

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
          {bankSoal?.nama ?? "Daftar Soal"}
        </h1>
        {bankSoal?.bab && (
          <p className="text-sm text-gray-500 mt-1">{bankSoal.bab.nama_bab}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
            Daftar Soal
          </h2>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search" />
        </div>

        <SoalTable
          soalList={soalList}
          isLoading={isLoading || !bankSoalId}
          canEdit={false}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </div>

      {meta && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
