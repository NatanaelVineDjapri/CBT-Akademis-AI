"use client";

import api from "@/services/api";
import type { UjianItem } from "./types";

export const fetcher = (url: string) => api.get(url).then(r => r.data);

export const STATUS_MAP = {
  belum_mulai: { label: "Belum Mulai", bg: "var(--akademik-tahun-bg)",  color: "var(--akademik-tahun-icon)" },
  berlangsung: { label: "Berlangsung", bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  selesai:     { label: "Selesai",     bg: "var(--color-primary-light)", color: "var(--color-primary)" },
};

export function StatusBadge({ status }: { status: UjianItem["status"] }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export function fmt(dt: string | null) {
  if (!dt) return "-";
  // Strip timezone suffix so browser treats it as local time, not UTC
  const normalized = dt.replace(" ", "T").replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "");
  const d = new Date(normalized);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    + " " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export const JENIS_BADGE: Record<string, { label: string; color: string }> = {
  pilihan_ganda: { label: "PG",        color: "var(--color-primary)" },
  essay:         { label: "Essay",     color: "var(--color-warning)" },
  checklist:     { label: "Checklist", color: "var(--akademik-prodi-icon)" },
};

export const KESULITAN_BADGE: Record<string, { label: string; color: string }> = {
  mudah:  { label: "Mudah",  color: "#22c55e" },
  sedang: { label: "Sedang", color: "var(--color-warning)" },
  sulit:  { label: "Sulit",  color: "#ef4444" },
};

export const JENIS_OPTIONS = [
  { value: "pilihan_ganda", label: "Pilihan Ganda" },
  { value: "essay",         label: "Essay" },
  { value: "checklist",     label: "Checklist" },
];

export const KESULITAN_OPTIONS = [
  { value: "mudah",  label: "Mudah" },
  { value: "sedang", label: "Sedang" },
  { value: "sulit",  label: "Sulit" },
];

export const OPSI_KEYS = ["A", "B", "C", "D"];

export const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]";
export const labelCls = "text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide";
