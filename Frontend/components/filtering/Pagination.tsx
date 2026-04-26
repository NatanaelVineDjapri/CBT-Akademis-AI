"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

function getPages(current: number, last: number): (number | "...")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", last];
  if (current >= last - 3) return [1, "...", last - 4, last - 3, last - 2, last - 1, last];
  return [1, "...", current - 1, current, current + 1, "...", last];
}

export default function Pagination({ currentPage, lastPage, total, perPage, onPageChange }: Props) {
  if (lastPage <= 1) return null;

  const pages = getPages(currentPage, lastPage);
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="shrink-0 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 pt-4">
      <p className="text-xs text-gray-400">{from}–{to} dari {total} data</p>
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-default cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className="w-8 h-8 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
              style={
                p === currentPage
                  ? { background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary)" }
                  : { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
              }
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-default cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
