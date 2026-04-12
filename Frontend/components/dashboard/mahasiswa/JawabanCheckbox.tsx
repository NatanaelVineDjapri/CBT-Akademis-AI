"use client";

import { useState } from "react";

const cbData = [
  { no: "01", soal: "Yang termasuk unsur adalah...", kunci: "A,B", jawaban: "A,B", poin: 1 },
  { no: "02", soal: "Sifat-sifat logam antara lain...", kunci: "A,C,D", jawaban: "A,C", poin: 0 },
  { no: "03", soal: "Yang termasuk larutan asam adalah...", kunci: "B,D", jawaban: "B,D", poin: 1 },
  { no: "04", soal: "Contoh reaksi eksoterm adalah...", kunci: "A,B,C", jawaban: "A,B,C", poin: 1 },
  { no: "05", soal: "Partikel penyusun atom terdiri dari...", kunci: "A,B,C", jawaban: "A,B", poin: 0 },
  { no: "06", soal: "Yang termasuk campuran homogen adalah...", kunci: "A,C", jawaban: "A,C", poin: 1 },
  { no: "07", soal: "Sifat-sifat asam antara lain...", kunci: "B,C,D", jawaban: "B,C,D", poin: 1 },
  { no: "08", soal: "Contoh perubahan fisika adalah...", kunci: "A,D", jawaban: "A,B", poin: 0 },
  { no: "09", soal: "Yang termasuk reaksi redoks adalah...", kunci: "B,C", jawaban: "B,C", poin: 1 },
  { no: "10", soal: "Unsur golongan alkali tanah adalah...", kunci: "A,B,D", jawaban: "A,B,D", poin: 1 },
];

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function JawabanCheckBox() {
  const [search, setSearch] = useState("");

  const filtered = cbData.filter((d) =>
    d.soal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[var(--color-primary)]">
          Jawaban Check Box
        </h2>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="text-xs outline-none text-gray-600 w-32 bg-transparent"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[240px] rounded-xl border border-gray-100">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="text-left text-gray-400 font-medium px-3 py-2 w-10">#</th>
              <th className="text-left text-gray-400 font-medium px-3 py-2">Nama Ujian</th>
              <th className="text-left text-gray-400 font-medium px-3 py-2 w-28">Kunci Jawaban</th>
              <th className="text-left text-gray-400 font-medium px-3 py-2 w-28">Jawaban Siswa</th>
              <th className="text-left text-gray-400 font-medium px-3 py-2 w-20">Poin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((row) => (
              <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 text-gray-400">{row.no}</td>
                <td className="px-3 py-3 text-gray-700">{row.soal}</td>
                <td className="px-3 py-3 text-gray-600">{row.kunci}</td>
                <td className="px-3 py-3 text-gray-600">{row.jawaban}</td>
                <td className="px-3 py-3">
                  <span className="border border-gray-200 rounded-lg px-2 py-1 text-gray-600 text-xs">
                    {row.poin} poin
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