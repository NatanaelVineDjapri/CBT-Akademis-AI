import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { MataKuliah } from "@/types";

export default function MataKuliahCard({ mk }: { mk: MataKuliah }) {
  const dosenNama = mk.dosen_matkul?.[0]?.user?.nama ?? "-";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2 border border-gray-100">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--color-primary)" }}
        >
          <BookOpen
            className="w-5 h-5"
            style={{ color: "var(--color-primary-light)" }}
          />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {mk.nama}
          </p>
          <p className="text-xs text-gray-400">Dosen Pengurus:</p>
          <p className="text-xs text-gray-600 truncate">{dosenNama}</p>
        </div>
      </div>
      <Link
        href={`/mahasiswa/mata-kuliah/${mk.id}`}
        className="mt-auto w-full py-2 rounded-lg text-white text-xs font-medium text-center"
        style={{ background: "var(--color-primary)" }}
      >
        Telusuri Bank Soal Terkait
      </Link>
    </div>
  );
}
