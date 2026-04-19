"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchInput from "@/components/filtering/SearchInput";
import SoalTable from "@/components/soal/SoalTable";
import { getMataKuliahBabSoal } from "@/services/MataKuliahServices";
import { getMyMataKuliahDetail } from "@/services/MataKuliahServices";

interface Props {
  params: Promise<{ id: string; babId: string }>;
}

export default function MahasiswaBabSoalPage({ params }: Props) {
  const { id, babId } = use(params);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data: matkul } = useSWR(
    `/mata-kuliah/my/${id}`,
    () => getMyMataKuliahDetail(id),
    { revalidateOnFocus: false }
  );

  const { data: soalList = [], isLoading } = useSWR(
    ["/mata-kuliah/my", id, "bab", babId, "soal", debouncedSearch],
    () => getMataKuliahBabSoal(id, babId, { search: debouncedSearch }),
    { revalidateOnFocus: false }
  );

  const bab = matkul?.bab.find((b) => String(b.id) === babId);

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
          {bab?.nama_bab ?? "Daftar Soal"}
        </h1>
        {matkul && (
          <p className="text-sm text-gray-500 mt-1">{matkul.nama}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
            Daftar Soal
          </h2>
          <SearchInput value={search} onChange={setSearch} placeholder="Search" />
        </div>

        <SoalTable soalList={soalList} isLoading={isLoading} canEdit={false} />
      </div>
    </div>
  );
}
