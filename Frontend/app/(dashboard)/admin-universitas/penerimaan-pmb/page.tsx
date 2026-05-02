"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import ConfirmModal from "@/components/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";
import { getPmbPeserta, prosesPenerimaan } from "@/services/PmbPenerimaanServices";
import { getProdi } from "@/services/AdminUserServices";
import { useUser } from "@/context/UserContext";
import type { PmbPesertaItem } from "@/types";

type RowStatus = "pending" | "diterima" | "ditolak";

interface RowState {
  status: RowStatus;
  nim: string;
  prodi_id: string;
}

export default function PenerimaanPMBPage() {
  const { user } = useUser();
  const tahunSekarang = new Date().getFullYear();

  const [tahun, setTahun]     = useState(tahunSekarang);
  const [search, setSearch]   = useState("");
  const [rows, setRows]       = useState<Record<number, RowState>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing]   = useState(false);
  const [result, setResult]   = useState<{ diterima: number; ditolak: number } | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, mutate } = useSWR(
    ["/pmb/penerimaan/peserta", debouncedSearch, tahun],
    ([, s, t]: [string, string, number]) => getPmbPeserta({ search: s, tahun: t, per_page: 200 }),
    { revalidateOnFocus: false }
  );

  const { data: prodiList = [] } = useSWR(
    user?.universitas_id ? ["/prodi/penerimaan", user.universitas_id] : null,
    () => getProdi({ per_page: 200 }).then(r => r.data),
    { revalidateOnFocus: false }
  );

  const items: PmbPesertaItem[] = data?.data ?? [];

  useEffect(() => {
    setRows(prev => {
      const next = { ...prev };
      items.forEach(item => {
        if (!next[item.id]) {
          next[item.id] = {
            status:   "pending",
            nim:      item.nim ?? "",
            prodi_id: String(item.prodi_id ?? ""),
          };
        }
      });
      return next;
    });
  }, [items]);

  const setRow = (id: number, patch: Partial<RowState>) =>
    setRows(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const diterimaList  = items.filter(i => rows[i.id]?.status === "diterima");
  const ditolakList   = items.filter(i => rows[i.id]?.status === "ditolak");
  const pendingCount  = items.filter(i => rows[i.id]?.status === "pending").length;
  const canProses     = (diterimaList.length + ditolakList.length) > 0 && !processing;

  const handleProses = async () => {
    setProcessing(true);
    setShowConfirm(false);
    try {
      const res = await prosesPenerimaan({
        tahun,
        diterima: diterimaList.map(i => ({
          user_id:  i.id,
          nim:      rows[i.id].nim || undefined,
          prodi_id: Number(rows[i.id].prodi_id),
        })),
        ditolak: ditolakList.map(i => i.id),
      });
      setResult({ diterima: res.total_diterima, ditolak: res.total_ditolak });
      mutate();
      setRows({});
    } finally {
      setProcessing(false);
    }
  };

  const tahunOptions = Array.from({ length: 5 }, (_, i) => tahunSekarang - i);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Penerimaan PMB
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Tandai peserta yang diterima atau ditolak, lalu proses.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={tahun}
              onChange={e => setTahun(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
            >
              {tahunOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari peserta..."
                className="border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] w-44"
              />
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canProses}
              className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {processing ? <Loader2 size={14} className="animate-spin" /> : null}
              Proses ({diterimaList.length + ditolakList.length})
            </button>
          </div>
        </div>

        {/* Result banner */}
        {result && (
          <div className="px-5 py-3 bg-green-50 border-b border-green-100 shrink-0">
            <p className="text-sm text-green-700 font-medium">
              Berhasil diproses — <span className="font-bold">{result.diterima}</span> diterima,{" "}
              <span className="font-bold">{result.ditolak}</span> ditolak.
            </p>
          </div>
        )}

        {/* Summary pills */}
        {items.length > 0 && (
          <div className="flex gap-3 px-5 pt-3 shrink-0">
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              Pending: <b>{pendingCount}</b>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              Diterima: <b>{diterimaList.length}</b>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-600">
              Ditolak: <b>{ditolakList.length}</b>
            </span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-10">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nama</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Email</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-32">Tahun Masuk</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-36">NIM (jika diterima)</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-44">Prodi</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-36">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-sm text-gray-400 py-12">
                    Tidak ada peserta PMB{search ? ` untuk pencarian "${search}"` : ` tahun ${tahun}`}.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const row    = rows[item.id] ?? { status: "pending", nim: "", prodi_id: "" };
                  const isDiterima = row.status === "diterima";
                  const isDitolak  = row.status === "ditolak";
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-50 transition-colors ${
                        isDiterima ? "bg-green-50/60" : isDitolak ? "bg-red-50/40" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-5 py-3 text-xs text-gray-400">{String(idx + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{item.nama}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{item.email}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{item.tahun_masuk ?? "-"}</td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={row.nim}
                          onChange={e => setRow(item.id, { nim: e.target.value })}
                          disabled={!isDiterima}
                          placeholder="NIM"
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={row.prodi_id}
                          onChange={e => setRow(item.id, { prodi_id: e.target.value })}
                          disabled={!isDiterima}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:border-[var(--color-primary)]"
                        >
                          <option value="">Pilih prodi</option>
                          {prodiList.map(p => (
                            <option key={p.id} value={p.id}>{p.nama}</option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setRow(item.id, { status: isDiterima ? "pending" : "diterima" })}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                              isDiterima ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"
                            }`}
                          >
                            <CheckCircle size={12} />
                            Diterima
                          </button>
                          <button
                            onClick={() => setRow(item.id, { status: isDitolak ? "pending" : "ditolak" })}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                              isDitolak ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
                            }`}
                          >
                            <XCircle size={12} />
                            Ditolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Proses Penerimaan PMB"
          message={`${diterimaList.length} peserta akan diterima (role diubah ke Mahasiswa) dan ${ditolakList.length} peserta akan ditolak (akun dihapus). Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Ya, Proses"
          onConfirm={handleProses}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
