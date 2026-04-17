"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { BankSoalItem } from "@/types";
import { getBabByMataKuliah, type BabOption } from "@/services/BankSoalServices";

const PERMISSIONS = [
  { value: "public", label: "Publik" },
  { value: "shared", label: "Shared" },
  { value: "private", label: "Private" },
];

interface MataKuliahOption {
  id: number;
  nama: string;
  kode: string;
}

interface Props {
  mode: "create" | "edit";
  item?: BankSoalItem;
  mataKuliahOptions: MataKuliahOption[];
  onClose: () => void;
  onSubmit: (data: {
    nama: string;
    deskripsi: string;
    mata_kuliah_id: number | null;
    bab_id: number | null;
    permission: string;
  }) => Promise<void>;
}

export default function BankSoalFormModal({
  mode,
  item,
  mataKuliahOptions,
  onClose,
  onSubmit,
}: Props) {
  const [nama, setNama] = useState(item?.nama ?? "");
  const [deskripsi, setDeskripsi] = useState(item?.deskripsi ?? "");
  const [mataKuliahId, setMataKuliahId] = useState<number | null>(item?.mata_kuliah_id ?? null);
  const [babId, setBabId] = useState<number | null>(item?.bab_id ?? null);
  const [permission, setPermission] = useState<'public' | 'shared' | 'private'>(item?.permission ?? "private");
  const [babOptions, setBabOptions] = useState<BabOption[]>([]);
  const [loadingBab, setLoadingBab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none";

  useEffect(() => {
    if (!mataKuliahId) { setBabOptions([]); setBabId(null); return; }
    setLoadingBab(true);
    getBabByMataKuliah(mataKuliahId)
      .then(setBabOptions)
      .finally(() => setLoadingBab(false));
  }, [mataKuliahId]);

  const handleMataKuliahChange = (val: string) => {
    setMataKuliahId(val ? Number(val) : null);
    setBabId(null);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (mataKuliahId && !babId) {
      setError("Bab wajib dipilih.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ nama, deskripsi, mata_kuliah_id: mataKuliahId, bab_id: babId, permission });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <h3 className="text-base font-bold text-white">
            {mode === "create" ? "Tambah Bank Soal" : "Edit Bank Soal"}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Bank Soal</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className={inputClass + " resize-none"}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Mata Kuliah</label>
            <select
              value={mataKuliahId ?? ""}
              onChange={(e) => handleMataKuliahChange(e.target.value)}
              className={inputClass}
            >
              <option value="">— Tidak dipilih —</option>
              {mataKuliahOptions.map((mk) => (
                <option key={mk.id} value={mk.id}>
                  {mk.kode} — {mk.nama}
                </option>
              ))}
            </select>
          </div>

          {mataKuliahId && (
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Bab</label>
              {loadingBab ? (
                <div className={inputClass + " text-gray-400 cursor-not-allowed bg-gray-50"}>Memuat bab...</div>
              ) : babOptions.length === 0 ? (
                <div className={inputClass + " text-gray-400 cursor-not-allowed bg-gray-50"}>Tidak ada bab untuk mata kuliah ini.</div>
              ) : (
                <select
                  value={babId ?? ""}
                  onChange={(e) => setBabId(e.target.value ? Number(e.target.value) : null)}
                  className={inputClass}
                >
                  <option value="">— Semua Bab —</option>
                  {babOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      Bab {b.urutan} — {b.nama_bab}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Permission</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'public' | 'shared' | 'private')}
              className={inputClass}
            >
              {PERMISSIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
