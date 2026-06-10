"use client";

import { useState } from "react";
import type { JawabanCheckbox as JawabanCheckboxType } from "@/types";
import SearchInput from "@/components/filtering/SearchInput";

export default function JawabanCheckBox({ data }: { data: JawabanCheckboxType[] }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((d) =>
    d.soal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-base font-semibold text-[var(--color-primary)]">
          Jawaban Check Box
        </h2>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari soal..." />
      </div>

      <div className="rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[480px] text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-gray-400 font-medium px-3 py-2 w-10">#</th>
              <th className="text-left text-gray-400 font-medium px-3 py-2">Soal</th>
              <th className="text-center text-gray-400 font-medium px-3 py-2 w-28">Kunci</th>
              <th className="text-center text-gray-400 font-medium px-3 py-2 w-28">Jawaban</th>
              <th className="text-center text-gray-400 font-medium px-3 py-2 w-20">Poin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-400">Tidak ada data.</td></tr>
            ) : filtered.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 text-gray-400">{String(row.no).padStart(2, "0")}</td>
                <td className="px-3 py-3 text-gray-700">{row.soal}</td>
                <td className="px-3 py-3 text-gray-600 text-center">{row.kunci}</td>
                <td className="px-3 py-3 text-center">
                  <span style={{ color: row.jawaban === row.kunci ? "var(--color-primary)" : "var(--color-danger, #ef4444)" }}>
                    {row.jawaban}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
                    {row.poin}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
