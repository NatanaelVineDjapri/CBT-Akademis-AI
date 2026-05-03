"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { UniversitasItem, createUniversitas, updateUniversitas } from "@/services/UniversitasService";

interface Props {
  editItem: UniversitasItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY = { nama: "", kode: "", alamat: "" };

export default function TambahUniversitasForm({ editItem, onClose, onSaved }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isEdit = !!editItem;

  useEffect(() => {
    if (editItem) {
      setForm({ nama: editItem.nama, kode: editItem.kode, alamat: editItem.alamat ?? "" });
      setPreview(editItem.logo ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${editItem.logo}` : null);
      setLogo(null);
    } else {
      setForm(EMPTY);
      setPreview(null);
      setLogo(null);
    }
    setError(null);
  }, [editItem]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogo(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.kode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("nama", form.nama.trim());
      fd.append("kode", form.kode.trim());
      if (form.alamat.trim()) fd.append("alamat", form.alamat.trim());
      if (logo) fd.append("logo", logo);

      if (isEdit) {
        await updateUniversitas(editItem!.id, fd);
      } else {
        await createUniversitas(fd);
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
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">
            {isEdit ? "Edit Universitas" : "Tambah Universitas"}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Universitas <span className="text-red-400">*</span></label>
            <input
              value={form.nama}
              onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              placeholder="Universitas Tarumanagara"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kode <span className="text-red-400">*</span></label>
            <input
              value={form.kode}
              onChange={e => setForm(f => ({ ...f, kode: e.target.value.toUpperCase() }))}
              placeholder="UNTAR"
              required
              className={inputClass + " uppercase"}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Alamat</label>
            <input
              value={form.alamat}
              onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))}
              placeholder="Jl. S. Parman No.1, Jakarta Barat"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Logo</label>
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} alt="preview" className="w-10 h-10 rounded-lg object-contain border border-gray-100 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                  {form.kode ? form.kode.slice(0, 1) : "?"}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-white text-sm px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Pilih File
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">PNG, JPG maks. 2MB</p>
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
