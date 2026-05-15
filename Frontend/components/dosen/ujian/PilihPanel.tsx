"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import SearchInput from "@/components/filtering/SearchInput";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/services/api";
import { JENIS_BADGE, KESULITAN_BADGE } from "./constants";
import type { AvailableSoalItem, BabOption, LocalSoalItem } from "./types";

export default function PilihPanel({
  mode, ujianId, matkulId, excludeIds, babs, onSaved, onAdd, onClose, apiPath = "/ujian/dosen",
}: {
  mode: "create" | "edit";
  ujianId?: string;
  matkulId?: number;
  excludeIds?: number[];
  babs: BabOption[];
  onSaved?: () => void;
  onAdd?: (items: LocalSoalItem[]) => void;
  onClose: () => void;
  apiPath?: string;
}) {
  const [babId, setBabId]       = useState("");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage]         = useState(1);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const debouncedSearch         = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, babId]);

  const swrKey = mode === "create"
    ? ["/available-soal-create", matkulId, excludeIds?.join(","), babId, debouncedSearch, page]
    : ["/available-soal", ujianId, babId, debouncedSearch, page];

  const { data, isLoading } = useSWR(
    swrKey,
    () => mode === "create"
      ? api.get(`${apiPath}/0/available-soal`, {
          params: {
            mata_kuliah_id: matkulId,
            exclude_ids:    excludeIds?.join(",") || undefined,
            bab_id:         babId || undefined,
            search:         debouncedSearch || undefined,
            page,
            per_page:       20,
          },
        }).then(r => r.data)
      : api.get(`${apiPath}/${ujianId}/available-soal`, {
          params: { bab_id: babId || undefined, search: debouncedSearch || undefined, page, per_page: 20 },
        }).then(r => r.data),
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  const soalList: AvailableSoalItem[] = data?.data ?? [];
  const meta = data?.meta;
  const pageIds    = soalList.map(s => s.id);
  const allChecked = pageIds.length > 0 && pageIds.every(id => selected.includes(id));

  const toggle = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () => {
    if (allChecked) setSelected(prev => prev.filter(id => !pageIds.includes(id)));
    else setSelected(prev => [...new Set([...prev, ...pageIds])]);
  };

  const handleAdd = async () => {
    if (selected.length === 0) { setError("Pilih minimal 1 soal."); return; }
    if (mode === "create") {
      const items: LocalSoalItem[] = soalList
        .filter(s => selected.includes(s.id))
        .map(s => ({ _localId: `soal_${s.id}`, soal_id: s.id, bobot: 1.0, deskripsi: s.deskripsi, jenis_soal: s.jenis_soal, tingkat_kesulitan: s.tingkat_kesulitan, bab: s.bab }));
      onAdd?.(items);
      onClose();
      return;
    }
    setSaving(true); setError("");
    try {
      await api.post(`${apiPath}/${ujianId}/soal`, { soal_ids: selected });
      onSaved?.(); onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal menambahkan soal.");
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="overflow-y-auto flex-1 p-5">
        <div className="flex gap-2 mb-4">
          <select value={babId} onChange={e => setBabId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] flex-1">
            <option value="">Semua Bab</option>
            {babs.map(b => <option key={b.id} value={b.id}>{b.nama_bab}</option>)}
          </select>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari soal..." />
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-2.5 w-8">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll}
                    className="accent-[var(--color-primary)] cursor-pointer" />
                </th>
                <th className="text-left text-xs text-gray-400 font-medium px-3 py-2.5">Soal</th>
                <th className="text-left text-xs text-gray-400 font-medium px-3 py-2.5 w-20">Jenis</th>
                <th className="text-left text-xs text-gray-400 font-medium px-3 py-2.5 w-24">Kesulitan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    {[0, 1, 2, 3].map(j => (
                      <td key={j} className="px-3 py-3"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : soalList.map(s => (
                <tr key={s.id} onClick={() => toggle(s.id)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)}
                      className="accent-[var(--color-primary)] cursor-pointer" />
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-800 text-xs line-clamp-2">{s.deskripsi}</p>
                    {s.bab && <span className="text-xs text-gray-400">{s.bab}</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium"
                      style={{ color: JENIS_BADGE[s.jenis_soal ?? ""]?.color ?? "#6b7280" }}>
                      {JENIS_BADGE[s.jenis_soal ?? ""]?.label ?? s.jenis_soal ?? "-"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium"
                      style={{ color: KESULITAN_BADGE[s.tingkat_kesulitan ?? ""]?.color ?? "#6b7280" }}>
                      {KESULITAN_BADGE[s.tingkat_kesulitan ?? ""]?.label ?? s.tingkat_kesulitan ?? "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && soalList.length === 0 && (
            <EmptyState message="Tidak ada soal tersedia." flat />
          )}
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>{meta.total} soal tersedia</span>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">←</button>
              <span className="px-2">{page} / {meta.last_page}</span>
              <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">→</button>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center gap-3">
        <span className="text-xs text-gray-500 flex-1">{selected.length} soal dipilih</span>
        <button onClick={onClose}
          className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
          Batal
        </button>
        <button onClick={handleAdd} disabled={saving || selected.length === 0}
          className="text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {saving
            ? <><Loader2 size={14} className="animate-spin" />Menambahkan...</>
            : `Tambah ${selected.length > 0 ? `${selected.length} ` : ""}Soal`}
        </button>
      </div>
    </>
  );
}
