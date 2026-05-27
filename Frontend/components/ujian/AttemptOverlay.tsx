"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { NilaiAttempt } from "@/types";
import { getBarColor } from "@/utils/nilai";

function StatusBadge({ lulus }: { lulus: boolean }) {
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={lulus
        ? { backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }
        : { backgroundColor: "#fee2e2", color: "#ef4444" }}>
      {lulus ? "Lulus" : "Tidak Lulus"}
    </span>
  );
}

interface Props {
  nama: string;
  attempts: NilaiAttempt[];
  onClose: () => void;
  getDetailHref?: (id: number) => string;
}

export default function AttemptOverlay({ nama, attempts, onClose, getDetailHref }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
          <div>
            <p className="text-sm font-bold text-white">{nama}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{attempts.length}x attempt</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/20">
            <X size={16} className="text-white" />
          </button>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-16">Attempt</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Tanggal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nilai</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Grade</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
                {getDetailHref && <th className="text-left text-xs text-gray-400 font-medium px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {attempts.map((a, i) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400 font-medium">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-700">{a.tanggal}</p>
                    <p className="text-xs text-gray-400">{a.pukul}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: getBarColor(a.nilai) }}>
                    {a.nilai ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold" style={{ color: a.lulus ? "var(--color-primary)" : "#ef4444" }}>
                      {a.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge lulus={a.lulus} /></td>
                  {getDetailHref && (
                    <td className="px-4 py-3">
                      <Link
                        href={getDetailHref(a.id)}
                        onClick={onClose}
                        className="text-xs font-medium hover:underline"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Detail
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
