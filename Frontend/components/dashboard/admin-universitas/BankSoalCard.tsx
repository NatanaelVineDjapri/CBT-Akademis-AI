import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { AdminUniversitasDashboard } from "@/types";

export default function BankSoalCard({ data }: { data: AdminUniversitasDashboard['bank_soal'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Bank Soal Terbaru</span>
        </div>
        {data.length > 0 && (
          <Link
            href="/admin-universitas/bank-soal"
            className="text-xs border rounded-lg px-3 py-1 transition-colors hover:opacity-80"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-gray-400 flex-1">Belum ada bank soal.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((b) => (
            <div key={b.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  <BookOpen size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{b.nama}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{b.jumlah_soal} soal</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${b.permission === 'private' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {b.permission === 'private' ? 'Draft' : 'Publik'}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/admin-universitas/bank-soal"
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
