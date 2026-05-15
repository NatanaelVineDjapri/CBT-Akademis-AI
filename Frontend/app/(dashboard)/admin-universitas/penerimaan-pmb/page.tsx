"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { CheckCircle, XCircle, Loader2, Wand2 } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import ConfirmModal from "@/components/ConfirmModal";
import Pagination from "@/components/filtering/Pagination";
import SearchInput from "@/components/filtering/SearchInput";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import { getPmbPeserta, prosesPenerimaan } from "@/services/PmbPenerimaanServices";
import { useUser } from "@/context/UserContext";
import type { PmbPesertaItem, PmbNimSequences } from "@/types";

type RowStatus = "pending" | "diterima" | "ditolak";

interface RowState {
  status: RowStatus;
  nim: string;
}

export default function PenerimaanPMBPage() {
  useUser();
  const tahunSekarang = new Date().getFullYear();

  const [tahun, setTahun]   = useState(tahunSekarang);
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const perPage             = usePerPage(53, 1, 455);
  const [rows, setRows]     = useState<Record<number, RowState>>({});
  const [showConfirm, setShowConfirm]     = useState(false);
  const [processing, setProcessing]       = useState(false);
  const [result, setResult]               = useState<{ diterima: number; ditolak: number } | null>(null);
  const [showAutoFill, setShowAutoFill]   = useState(false);
  const [batasNilai, setBatasNilai]       = useState("60");
  const [autoFillLoading, setAutoFillLoading] = useState(false);

  const debouncedSearch = useDebounce(search);

  // Simpan semua item yang pernah dilihat lintas halaman
  const allItemsRef     = useRef<Record<number, PmbPesertaItem>>({});
  // Base count mahasiswa existing per prodi (dari API), dan counter lokal sesi ini
  const nimSequencesRef = useRef<PmbNimSequences>({});
  const nimAssignedRef  = useRef<Record<string, number>>({});

  useEffect(() => { setPage(1); }, [debouncedSearch, tahun, perPage]);

  // Reset counter lokal saat tahun ganti
  useEffect(() => { nimAssignedRef.current = {}; }, [tahun]);

  const { data, isLoading, mutate } = useSWR(
    ["/pmb/penerimaan/peserta", debouncedSearch, tahun, page, perPage],
    ([, s, t, p, pp]: [string, string, number, number, number]) =>
      getPmbPeserta({ search: s, tahun: t, page: p, per_page: pp }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );


  const items: PmbPesertaItem[] = data?.data ?? [];
  const meta = data?.meta;

  // Sync nim_sequences dari API
  useEffect(() => {
    if (data?.nim_sequences) nimSequencesRef.current = data.nim_sequences;
  }, [data?.nim_sequences]);

  const generateNim = (item: PmbPesertaItem): string => {
    const prefix = item.prodi?.nim_prefix;
    if (!prefix || !item.prodi_id) return "";
    const key    = String(item.prodi_id);
    const base   = nimSequencesRef.current[key] ?? 0;
    const local  = nimAssignedRef.current[key]  ?? 0;
    const seq    = base + local + 1;
    return prefix + String(tahun).slice(-2) + String(seq).padStart(4, "0");
  };

  const handleToggleDiterima = (item: PmbPesertaItem) => {
    const key = String(item.prodi_id);
    if (rows[item.id]?.status === "diterima") {
      nimAssignedRef.current[key] = Math.max(0, (nimAssignedRef.current[key] ?? 1) - 1);
      setRow(item.id, { status: "pending", nim: "" });
    } else {
      const nim = generateNim(item);
      if (item.prodi?.nim_prefix) nimAssignedRef.current[key] = (nimAssignedRef.current[key] ?? 0) + 1;
      setRow(item.id, { status: "diterima", nim });
    }
  };

  // Daftarkan item baru ke ref dan rows — return prev jika tidak ada perubahan
  useEffect(() => {
    items.forEach(item => { allItemsRef.current[item.id] = item; });

    setRows(prev => {
      let changed = false;
      const next = { ...prev };
      items.forEach(item => {
        if (!next[item.id]) {
          next[item.id] = {
            status: "pending",
            nim:    item.nim ?? "",
          };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [items]);

  const setRow = (id: number, patch: Partial<RowState>) =>
    setRows(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  // Hitung lintas semua halaman dari rows
  const diterimaEntries = Object.entries(rows).filter(([, r]) => r.status === "diterima");
  const ditolakEntries  = Object.entries(rows).filter(([, r]) => r.status === "ditolak");
  const diterimaList    = diterimaEntries.map(([id]) => allItemsRef.current[Number(id)]).filter(Boolean);
  const ditolakList     = ditolakEntries.map(([id]) => allItemsRef.current[Number(id)]).filter(Boolean);
  const pendingCount    = (meta?.total ?? 0) - diterimaList.length - ditolakList.length;
  const canProses       = (diterimaList.length + ditolakList.length) > 0 && !processing;

  const handleProses = async () => {
    setProcessing(true);
    setShowConfirm(false);
    try {
      const res = await prosesPenerimaan({
        tahun,
        diterima: diterimaList.map(i => ({
          user_id: i.id,
          nim:     rows[i.id].nim || undefined,
        })),
        ditolak: ditolakList.map(i => i.id),
      });
      setResult({ diterima: res.total_diterima, ditolak: res.total_ditolak });
      mutate();
      setRows({});
      allItemsRef.current = {};
    } finally {
      setProcessing(false);
    }
  };

  const handleAutoFill = async () => {
    setAutoFillLoading(true);
    try {
      const allData = await getPmbPeserta({ tahun, per_page: 500 });
      const allPeserta = allData.data;
      allPeserta.forEach(item => { allItemsRef.current[item.id] = item; });

      // Sync nim_sequences dari fetch all
      if (allData.nim_sequences) nimSequencesRef.current = allData.nim_sequences;
      nimAssignedRef.current = {};

      const threshold = Number(batasNilai);
      setRows(prev => {
        const next = { ...prev };
        allPeserta.forEach(item => {
          const nilai  = item.nilai_pmb ?? null;
          const terima = nilai !== null && nilai >= threshold;
          const key    = String(item.prodi_id);

          if (terima) {
            const nim = generateNim(item);
            if (item.prodi?.nim_prefix) nimAssignedRef.current[key] = (nimAssignedRef.current[key] ?? 0) + 1;
            next[item.id] = { status: "diterima", nim };
          } else {
            next[item.id] = { status: nilai !== null ? "ditolak" : "pending", nim: item.nim ?? (next[item.id]?.nim ?? "") };
          }
        });
        return next;
      });
      setShowAutoFill(false);
    } finally {
      setAutoFillLoading(false);
    }
  };

  const tahunOptions = Array.from({ length: 5 }, (_, i) => tahunSekarang - i);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div className="flex-1">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
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

            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Cari peserta..." />

            {/* Auto-isi */}
            <div className="relative">
              <button
                onClick={() => setShowAutoFill(v => !v)}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg cursor-pointer transition-colors"
                style={showAutoFill
                  ? { backgroundColor: "var(--color-primary)", color: "#fff" }
                  : { backgroundColor: "var(--color-primary-light, #eff6ff)", color: "var(--color-primary)" }
                }
              >
                <Wand2 size={14} />
                Auto-isi
              </button>
              {showAutoFill && (
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl z-20 w-64 border border-gray-200"
                  style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}>
                  <div className="px-4 pt-3.5 pb-1">
                    <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--color-primary)" }}>
                      Terima jika nilai ≥
                    </p>
                    <p className="text-xs text-gray-400">Peserta tanpa nilai tetap pending.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 pb-3.5 pt-2.5 border-t border-gray-100 mt-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={batasNilai}
                      onChange={e => setBatasNilai(e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-gray-300"
                    />
                    <span className="text-xs text-gray-400 font-medium">/ 100</span>
                    <button
                      onClick={handleAutoFill}
                      disabled={autoFillLoading}
                      className="ml-auto flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white disabled:opacity-50 cursor-pointer"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {autoFillLoading ? <Loader2 size={11} className="animate-spin" /> : null}
                      Terapkan
                    </button>
                  </div>
                </div>
              )}
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
        {Object.keys(rows).length > 0 && (
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
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-10">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-44">Nama</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-48">Email</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-28">Tahun Masuk</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-36">NIM (jika diterima)</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-40">Prodi</th>
                <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 w-24">Nilai PMB</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-44">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? null : (
                items.map((item, idx) => {
                  const row        = rows[item.id] ?? { status: "pending", nim: "", prodi_id: "" };
                  const isDiterima = row.status === "diterima";
                  const isDitolak  = row.status === "ditolak";
                  const no         = ((meta?.current_page ?? 1) - 1) * perPage + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-50 transition-colors ${
                        isDiterima ? "bg-green-50/50" : isDitolak ? "bg-red-50/30" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-5 py-3 text-xs text-gray-400">{String(no).padStart(2, "0")}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 truncate">{item.nama}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 truncate">{item.email}</td>
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

                      <td className="px-4 py-3 text-xs text-gray-700">
                        {item.prodi?.nama ?? "-"}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {item.nilai_pmb != null ? (
                          <span className={`text-xs font-semibold tabular-nums ${
                            item.nilai_pmb >= 60 ? "text-green-600" : "text-red-500"
                          }`}>
                            {item.nilai_pmb}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleToggleDiterima(item)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                              isDiterima ? "bg-green-50 text-green-500 border border-green-200" : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-500"
                            }`}
                          >
                            <CheckCircle size={12} />
                            Diterima
                          </button>
                          <button
                            onClick={() => setRow(item.id, { status: isDitolak ? "pending" : "ditolak" })}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                              isDitolak ? "bg-red-50 text-red-400 border border-red-200" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400"
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

          {!isLoading && items.length === 0 && (
            <EmptyState
              message={search ? `Tidak ada peserta untuk pencarian "${search}".` : `Tidak ada peserta PMB tahun ${tahun}.`}
              flat
            />
          )}
        </div>

      </div>
      </div>

      {meta && (meta.last_page ?? 1) > 1 && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={setPage}
        />
      )}

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
