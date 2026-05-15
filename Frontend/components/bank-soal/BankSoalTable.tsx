"use client";

import { useRef } from "react";
import { Pencil, Trash2, Plus, Mail, BookOpen, CalendarDays } from "lucide-react";
import { JENIS_BADGE } from "@/components/dosen/ujian/constants";
import Link from "next/link";
import { preload } from "swr";
import api from "@/services/api";
import { getBabByMataKuliah, generateBankSoalLink } from "@/services/BankSoalServices";
import type { BankSoalItem, BankSoalMeta } from "@/types";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import EmptyState from "@/components/EmptyState";

const permissionLabel: Record<string, string> = {
  public: "Publik",
  shared: "Shared",
  private: "Private",
};

const jenisBg: Record<string, string> = {
  pilihan_ganda: "var(--color-primary-light)",
  essay:         "var(--color-warning-light)",
  checklist:     "var(--akademik-prodi-bg)",
};

const permissionBadge: Record<string, { bg: string; color: string }> = {
  public: { bg: "var(--color-primary-light)", color: "var(--color-primary)" },
  shared: { bg: "#dbeafe", color: "#2563eb" },
  private: { bg: "#f3f4f6", color: "#6b7280" },
};

interface Props {
  data: BankSoalItem[];
  meta: BankSoalMeta | null;
  search: string;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  onEdit: (item: BankSoalItem) => void;
  onDelete: (item: BankSoalItem) => void;
  onShare?: (item: BankSoalItem, link?: string) => void;
  canEdit: boolean;
  createHref?: string;
  onTambah?: () => void;
  basePath?: string;
}

export default function BankSoalTable({
  data,
  meta,
  search,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
  onShare,
  canEdit,
  createHref,
  onTambah,
  basePath = "/dosen/bank-soal",
}: Props) {
  const linkCache = useRef<Map<number, string>>(new Map());

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Bank Soal</h2>
            <p className="text-xs text-gray-400 mt-0.5">Kelola bank soal dan soal-soal Anda.</p>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Search"
            />
            {canEdit &&
              (onTambah ? (
                <button
                  onClick={onTambah}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Plus size={15} />
                  Tambah Baru
                </button>
              ) : createHref ? (
                <Link
                  href={createHref}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Plus size={15} />
                  Tambah Baru
                </Link>
              ) : null)}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nama Bank Soal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Bab</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Jumlah Soal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Jenis Soal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Diperbarui</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Permission</th>
                {canEdit && (
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-24">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => {
                  const rowNum = String(
                    ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 10) +
                      idx +
                      1,
                  ).padStart(2, "0");
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-xs text-gray-400">
                        {rowNum}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`${basePath}/${item.id}`}
                          className="font-medium hover:underline"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {item.nama}
                        </Link>
                        {item.mata_kuliah && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <BookOpen size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{item.mata_kuliah.nama}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 truncate">
                        {item.bab?.nama_bab ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{item.soal_count ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {(item.jenis_soal ?? []).map(j => {
                            const b = JENIS_BADGE[j];
                            return b ? (
                              <span key={j} className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: b.color, backgroundColor: jenisBg[j] ?? `${b.color}18` }}>
                                {b.label}
                              </span>
                            ) : null;
                          })}
                          {!item.jenis_soal?.length && <span className="text-xs text-gray-400">-</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.updated_at ? (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <CalendarDays size={11} className="text-gray-400 shrink-0" />
                            <span>{new Date(item.updated_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                          </div>
                        ) : <span className="text-xs text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={permissionBadge[item.permission]
                            ? { backgroundColor: permissionBadge[item.permission].bg, color: permissionBadge[item.permission].color }
                            : {}}>
                          {permissionLabel[item.permission] ?? item.permission}
                        </span>
                      </td>
                      {canEdit && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEdit(item)}
                              onMouseEnter={() => item.mata_kuliah_id && preload(`/bab?mata_kuliah_id=${item.mata_kuliah_id}`, () => getBabByMataKuliah(item.mata_kuliah_id!))}
                              className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => onDelete(item)}
                              className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                            {onShare && item.permission === "shared" && (
                              <button
                                onClick={() => onShare(item, linkCache.current.get(item.id))}
                                onMouseEnter={() => {
                                  preload(`/bank-soal/${item.id}/shared-users`, () => api.get(`/bank-soal/${item.id}/shared-users`).then(r => r.data.data));
                                  if (!linkCache.current.has(item.id)) {
                                    generateBankSoalLink(item.id).then(link => linkCache.current.set(item.id, link));
                                  }
                                }}
                                className="text-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
                                title="Bagikan"
                              >
                                <Mail size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {data.length === 0 && (
            <EmptyState message="Tidak ada bank soal." flat />
          )}
        </div>
      </div>

      {meta && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
