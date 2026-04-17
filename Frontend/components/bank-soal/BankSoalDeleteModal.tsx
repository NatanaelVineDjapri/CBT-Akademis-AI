"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import type { BankSoalItem } from "@/types";

interface Props {
  item: BankSoalItem;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function BankSoalDeleteModal({ item, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">Hapus Bank Soal</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, white)" }}>
              <Trash2 size={18} style={{ color: "var(--color-primary)" }} />
            </div>
            <p className="text-sm text-gray-700">
              Yakin ingin menghapus bank soal{" "}
              <span className="font-semibold">"{item.nama}"</span>?
              Semua soal di dalamnya akan ikut terhapus.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
