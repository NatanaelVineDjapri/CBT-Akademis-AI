"use client";

import useSWR from "swr";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/services/api";
import { inputCls, labelCls } from "./constants";
import type { AvailableSoalItem, BabOption, BankSoalOption, LocalSoalItem } from "./types";

export default function AcakPanel({
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
  const [babId, setBabId]           = useState("");
  const [bankSoalId, setBankSoalId] = useState("");
  const [jumlah, setJumlah]         = useState("10");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  const { data: bankSoalData } = useSWR(
    matkulId ? ["/bank-soal/acak", matkulId] : "/bank-soal/acak-all",
    () => api.get("/bank-soal", { params: { mata_kuliah_id: matkulId, per_page: 100 } }).then(r => r.data.data ?? []),
    { revalidateOnFocus: false },
  );
  const bankSoalOptions: BankSoalOption[] = bankSoalData ?? [];

  const handleAcak = async () => {
    const n = Number(jumlah);
    if (!n || n < 1) { setError("Jumlah minimal 1 soal."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "create") {
        const res = await api.get(`${apiPath}/0/available-soal`, {
          params: {
            mata_kuliah_id: matkulId,
            bab_id:         babId ? Number(babId) : undefined,
            bank_soal_id:   bankSoalId ? Number(bankSoalId) : undefined,
            exclude_ids:    excludeIds?.join(",") || undefined,
            per_page:       500,
          },
        });
        const all: AvailableSoalItem[] = res.data.data ?? [];
        const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, n);
        const items: LocalSoalItem[] = shuffled.map(s => ({
          _localId: `soal_${s.id}`, soal_id: s.id, bobot: 1.0, deskripsi: s.deskripsi,
          jenis_soal: s.jenis_soal, tingkat_kesulitan: s.tingkat_kesulitan, bab: s.bab,
        }));
        onAdd?.(items);
        onClose();
      } else {
        const res = await api.post(`${apiPath}/${ujianId}/soal/random`, {
          bab_id:       babId ? Number(babId) : undefined,
          bank_soal_id: bankSoalId ? Number(bankSoalId) : undefined,
          jumlah:       n,
        });
        setSuccess(res.data.message ?? "Soal berhasil ditambahkan!");
        onSaved?.();
        setTimeout(() => onClose(), 1500);
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Gagal mengambil soal acak.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="overflow-y-auto flex-1 p-5 space-y-4">
        <p className="text-sm text-gray-500">
          Sistem akan mengambil soal secara acak dari bank soal yang kamu miliki atau yang dibagikan kepadamu, sesuai mata kuliah ujian ini.
        </p>

        <div>
          <label className={labelCls}>Jumlah Soal yang Diambil</label>
          <input type="number" min={1} max={200} value={jumlah} onChange={e => setJumlah(e.target.value)}
            className={inputCls} placeholder="Contoh: 20" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Filter Bab <span className="text-gray-400 normal-case font-normal">(opsional)</span></label>
            <select value={babId} onChange={e => setBabId(e.target.value)} className={inputCls}>
              <option value="">Semua Bab</option>
              {babs.map(b => <option key={b.id} value={b.id}>{b.nama_bab}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Filter Bank Soal <span className="text-gray-400 normal-case font-normal">(opsional)</span></label>
            <select value={bankSoalId} onChange={e => setBankSoalId(e.target.value)} className={inputCls}>
              <option value="">Semua Bank Soal</option>
              {bankSoalOptions.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>
        </div>

        {error   && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">{success}</p>}
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
        <button onClick={onClose}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
          Batal
        </button>
        <button onClick={handleAcak} disabled={loading}
          className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {loading
            ? <><Loader2 size={14} className="animate-spin" />Mengambil...</>
            : `Ambil ${jumlah || ""} Soal Acak`}
        </button>
      </div>
    </>
  );
}
