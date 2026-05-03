"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProdiItem, createProdi, updateProdi } from "@/services/ProdiService";

interface Props {
  fakultasId: number;
  editItem: ProdiItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY = { nama: "", kode: "" };

export default function TambahProdiForm({ fakultasId, editItem, onClose, onSaved }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!editItem;

  useEffect(() => {
    if (editItem) {
      setForm({ nama: editItem.nama, kode: editItem.kode });
    } else {
      setForm(EMPTY);
    }
    setError(null);
  }, [editItem]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.kode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await updateProdi(editItem!.id, { nama: form.nama.trim(), kode: form.kode.trim() });
      } else {
        await createProdi({ fakultas_id: fakultasId, nama: form.nama.trim(), kode: form.kode.trim() });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">
            {isEdit ? "Edit Program Studi" : "Tambah Program Studi"}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Program Studi <span className="text-red-400">*</span></label>
            <input
              value={form.nama}
              onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              placeholder="Teknik Informatika"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kode <span className="text-red-400">*</span></label>
            <input
              value={form.kode}
              onChange={e => setForm(f => ({ ...f, kode: e.target.value.toUpperCase() }))}
              placeholder="TI"
              required
              className={inputClass + " uppercase"}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambahkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
