"use client";

import useSWR from "swr";
import { useState } from "react";
import { X } from "lucide-react";
import api from "@/services/api";
import PilihPanel from "./PilihPanel";
import BuatPanel from "./BuatPanel";
import AcakPanel from "./AcakPanel";
import type { BabOption, LocalSoalItem } from "./types";

export default function TambahSoalModal({
  mode, ujianId, matkulId, excludeIds, onClose, onSaved, onAdd, apiPath = "/ujian/dosen",
}: {
  mode: "create" | "edit";
  ujianId?: string;
  matkulId?: number;
  excludeIds?: number[];
  onClose: () => void;
  onSaved?: () => void;
  onAdd?: (items: LocalSoalItem[]) => void;
  apiPath?: string;
}) {
  const [tab, setTab] = useState<"pilih" | "buat" | "acak">("pilih");

  const { data: babs = [] } = useSWR<BabOption[]>(
    matkulId ? ["/bab/matkul-tambah", matkulId] : null,
    () => api.get("/bab", { params: { mata_kuliah_id: matkulId } }).then(r => r.data.data ?? []),
    { revalidateOnFocus: false },
  );

  const tabs = [
    { key: "pilih" as const, label: "Pilih dari Bank Soal" },
    { key: "buat"  as const, label: "Buat Soal Baru" },
    { key: "acak"  as const, label: "Acak dari Bank Soal" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">Tambah Soal ke Ujian</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex px-6 pt-3 pb-0 border-b border-gray-100 shrink-0 gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer"
              style={tab === t.key
                ? { backgroundColor: "var(--color-primary)", color: "white" }
                : { color: "#6b7280" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "pilih" && <PilihPanel mode={mode} ujianId={ujianId} matkulId={matkulId} excludeIds={excludeIds} babs={babs} onSaved={onSaved} onAdd={onAdd} onClose={onClose} apiPath={apiPath} />}
        {tab === "buat"  && <BuatPanel  mode={mode} ujianId={ujianId} matkulId={matkulId} babs={babs} onSaved={onSaved} onAdd={onAdd} onClose={onClose} apiPath={apiPath} />}
        {tab === "acak"  && <AcakPanel  mode={mode} ujianId={ujianId} matkulId={matkulId} excludeIds={excludeIds} babs={babs} onSaved={onSaved} onAdd={onAdd} onClose={onClose} apiPath={apiPath} />}
      </div>
    </div>
  );
}
