"use client";

import { Pencil, Trash2, Plus, Mail } from "lucide-react";
import Link from "next/link";
import type { BankSoalItem, BankSoalMeta } from "@/types";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";

const permissionLabel: Record<string, string> = {
  public: "Publik",
  shared: "Shared",
  private: "Private",
};

const permissionColor: Record<string, string> = {
  public: "text-green-600",
  shared: "text-blue-500",
  private: "text-gray-400",
};

interface Props {
  data: BankSoalItem[];
  meta: BankSoalMeta | null;
  search: string;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  onEdit: (item: BankSoalItem) => void;
  onDelete: (item: BankSoalItem) => void;
  onShare?: (item: BankSoalItem) => void;
  canEdit: boolean;
  createHref?: string;
  onTambah?: () => void;
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
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="bg-white rounded-2xl overflow-hidden"
        // style={{ border: "2px solid var(--color-primary)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2
            className="text-base font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Bank Soal
          </h2>
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
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-12">
                  #
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">
                  Nama Bank Soal
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">
                  Mata Kuliah
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">
                  Bab
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">
                  Jumlah Soal
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">
                  Permission
                </th>
                {canEdit && (
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={canEdit ? 7 : 6}
                    className="px-5 py-8 text-center text-sm text-gray-400"
                  >
                    Tidak ada bank soal.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => {
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
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <Link
                          href={`/dosen/bank-soal/${item.id}`}
                          className="hover:underline"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {item.nama}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.mata_kuliah?.kode ??
                          item.mata_kuliah?.nama ??
                          "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.bab?.nama_bab ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.soal_count ?? 0}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${permissionColor[item.permission]}`}
                      >
                        {permissionLabel[item.permission] ?? item.permission}
                      </td>
                      {canEdit && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEdit(item)}
                              className="text-green-500 hover:text-green-600 transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => onDelete(item)}
                              className="text-red-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                            {onShare && item.permission === "shared" && (
                              <button
                                onClick={() => onShare(item)}
                                className="text-blue-400 hover:text-blue-500 transition-colors"
                                title="Share via email"
                              >
                                <Mail size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
