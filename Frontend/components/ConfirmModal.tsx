"use client";

import { X, Loader2 } from "lucide-react";

interface Props {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title = "Konfirmasi",
  message,
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button type="button" onClick={onCancel} disabled={loading}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer disabled:opacity-50">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={loading}
            className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: danger ? "#ef4444" : "var(--color-primary)" }}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
