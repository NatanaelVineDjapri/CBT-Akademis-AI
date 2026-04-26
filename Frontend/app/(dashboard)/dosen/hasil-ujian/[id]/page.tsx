"use client";

import { useState } from "react";
import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import EmptyState from "@/components/EmptyState";
import { preload } from "swr";
import { getDetailUjianDosen, getDetailPesertaDosen } from "@/services/UjianServices";
import DaftarSiswaTableSkeleton from "@/components/skeleton/DaftarSiswaTableSkeleton";
import DistribusiJawabanTableSkeleton from "@/components/skeleton/DistribusiJawabanTableSkeleton";
import type { HasilUjianPeserta, HasilUjianDistribusiItem } from "@/types";

type PesertaSortBy = "nama" | "nilai";
type SortDir = "asc" | "desc";

const PESERTA_STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  Selesai:          { label: "Selesai",          bg: "var(--color-primary-light)", color: "var(--color-primary)" },
  "Perlu Pengecekan": { label: "Perlu Pengecekan", bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  Berlangsung:      { label: "Berlangsung",   bg: "var(--akademik-prodi-bg)",    color: "var(--akademik-prodi-icon)" },
  "Belum Mulai":    { label: "Belum Mulai",   bg: "var(--akademik-tahun-bg)",    color: "var(--akademik-tahun-icon)" },
  "Belum Selesai":  { label: "Belum Selesai", bg: "var(--akademik-alamat-bg)",   color: "var(--akademik-alamat-icon)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = PESERTA_STATUS_MAP[status] ?? { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function ColHeader({ label, col, sortBy, sortDir, onSort }: {
  label: string; col: PesertaSortBy; sortBy: PesertaSortBy; sortDir: SortDir;
  onSort: (col: PesertaSortBy) => void;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className="text-left text-xs text-gray-400 font-bold px-4 py-3 cursor-pointer select-none"
      onClick={() => onSort(col)}>
      <span className="flex items-center gap-1">
        {label}
        <Icon size={12} className={active ? "text-gray-600" : "text-gray-300"} />
      </span>
    </th>
  );
}


export default function DosenDetailUjianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data } = useSWR(
    `/ujian/dosen/hasil/${id}`,
    () => getDetailUjianDosen(id),
    { revalidateOnFocus: false, revalidateIfStale: false }
  );

  const [pesertaSearch, setPesertaSearch] = useState("");
  const [pesertaSortBy, setPesertaSortBy] = useState<PesertaSortBy>("nama");
  const [pesertaSortDir, setPesertaSortDir] = useState<SortDir>("asc");
  const [distribusiSearch, setDistribusiSearch] = useState("");

  const handlePesertaSort = (col: PesertaSortBy) => {
    if (col === pesertaSortBy) {
      setPesertaSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setPesertaSortBy(col);
      setPesertaSortDir("asc");
    }
  };

  const pesertaFiltered: HasilUjianPeserta[] = (data?.peserta ?? [])
    .filter(p => p.nama.toLowerCase().includes(pesertaSearch.toLowerCase()))
    .sort((a, b) => {
      if (pesertaSortBy === "nilai") {
        const av = a.nilai ?? -1;
        const bv = b.nilai ?? -1;
        return pesertaSortDir === "asc" ? av - bv : bv - av;
      }
      return pesertaSortDir === "asc"
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama);
    });

  const distribusiFiltered: HasilUjianDistribusiItem[] = (data?.distribusi ?? [])
    .filter(d => d.soal.toLowerCase().includes(distribusiSearch.toLowerCase()));

  const allOpsiKeys = Array.from(
    new Set(distribusiFiltered.flatMap(d => Object.keys(d.opsi)))
  ).sort();

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <Breadcrumb overrides={data ? { [id]: data.info.nama_ujian } : undefined} />
      </div>

      {/* Daftar Siswa */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Daftar Siswa
            </h2>
            {data && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "var(--color-primary)" }}>
                Total Siswa: {data.info.total_peserta}
              </span>
            )}
          </div>
          <SearchInput value={pesertaSearch} onChange={setPesertaSearch} placeholder="Search" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-12" />
              <col />
              <col className="w-36" />
              <col className="w-28" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-bold px-5 py-3">#</th>
                <ColHeader label="Nama Siswa" col="nama" sortBy={pesertaSortBy} sortDir={pesertaSortDir} onSort={handlePesertaSort} />
                <th className="text-left text-xs text-gray-400 font-bold px-4 py-3">Status</th>
                <ColHeader label="Nilai" col="nilai" sortBy={pesertaSortBy} sortDir={pesertaSortDir} onSort={handlePesertaSort} />
              </tr>
            </thead>
            <tbody>
              {!data ? (
                <DaftarSiswaTableSkeleton count={5} />
              ) : pesertaFiltered.length === 0 ? null : (
                pesertaFiltered.map((p, idx) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-400">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-4 font-medium text-gray-800 truncate">
                      {p.nilai !== null ? (
                        <Link
                          href={`/dosen/hasil-ujian/${id}/${p.id}`}
                          className="hover:underline"
                          style={{ color: "var(--color-primary)" }}
                          onMouseEnter={() => preload(`/ujian/dosen/hasil/${id}/peserta/${p.id}`, () => getDetailPesertaDosen(id, p.id))}
                        >
                          {p.nama}
                        </Link>
                      ) : p.nama}
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-4">
                      {p.nilai !== null ? (
                        <span className="font-semibold" style={{ color: p.lulus ? "var(--color-primary)" : "var(--color-danger, #ef4444)" }}>
                          {p.nilai}/100
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {data && pesertaFiltered.length === 0 && (
            <EmptyState message="Tidak ada siswa ditemukan." />
          )}
        </div>
      </div>

      {/* Distribusi Jawaban PG dan Checkbox */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
            Distribusi Jawaban PG dan Check Box
          </h2>
          <SearchInput value={distribusiSearch} onChange={setDistribusiSearch} placeholder="Search" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-bold px-5 py-3 w-12">#</th>
                <th className="text-left text-xs text-gray-400 font-bold px-4 py-3">Nama Soal</th>
                {allOpsiKeys.map(k => (
                  <th key={k} className="text-left text-xs text-gray-400 font-bold px-4 py-3 w-24">
                    Pilihan {k}
                  </th>
                ))}
                <th className="text-left text-xs text-gray-400 font-bold px-4 py-3 w-32">Tingkat Ketepatan</th>
              </tr>
            </thead>
            <tbody>
              {!data ? (
                <DistribusiJawabanTableSkeleton count={5} cols={6} />
              ) : distribusiFiltered.length === 0 ? null : (
                distribusiFiltered.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-400">{String(item.no).padStart(2, "0")}</td>
                    <td className="px-4 py-4 text-gray-700 max-w-[240px] truncate" title={item.soal}>
                      {item.soal}
                    </td>
                    {allOpsiKeys.map(k => {
                      const count = item.opsi[k] ?? 0;
                      const isKunci = item.kunci.split(",").includes(k);
                      return (
                        <td key={k} className="px-4 py-4 text-sm font-medium"
                          style={{ color: isKunci ? "var(--color-primary)" : "#6b7280" }}>
                          {count > 0 ? `${count} siswa` : <span className="text-gray-300">-</span>}
                        </td>
                      );
                    })}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-gray-700">{item.tingkat_ketepatan}%</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {data && distribusiFiltered.length === 0 && (
            <EmptyState message="Tidak ada soal PG / checkbox." />
          )}
        </div>
      </div>
    </div>
  );
}
