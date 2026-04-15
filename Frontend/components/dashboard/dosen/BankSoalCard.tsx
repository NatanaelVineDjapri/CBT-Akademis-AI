"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import type { DosenBankSoalItem } from "@/services/DashboardServices";

export default function BankSoalCard({ data }: { data: DosenBankSoalItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">
            Bank Soal Terbaru
          </span>
        </div>
        {data.length > 0 && (
          <Link
            href="/dosen/bank-soal"
            className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
            }}
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada Bank Soal terbaru </p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((soal) => (
            <div
              key={soal.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--color-primary-light, #e0f7fa)",
                  }}
                >
                  <FileText
                    size={16}
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {soal.nama}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">
                      {soal.jumlah_soal} soal
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        soal.permission === "private"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {soal.permission === "private" ? "Draft" : "Publik"}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={`/dosen/bank-soal`}
                className="text-xs text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
