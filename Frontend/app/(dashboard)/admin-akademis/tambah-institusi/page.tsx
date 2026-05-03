"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import DaftarUniversitasTable from "@/components/admin-akademis/DaftarUniversitasTable";
import TambahUniversitasForm from "@/components/admin-akademis/TambahUniversitasForm";
import { UniversitasItem } from "@/services/UniversitasService";

export default function InstitusiPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<UniversitasItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (item: UniversitasItem) => { setEditItem(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };
  const handleSaved = () => setRefreshKey(k => k + 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Institusi</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data universitas yang terdaftar pada platform</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Plus size={16} />
          Tambah Institusi
        </button>
      </div>

      <DaftarUniversitasTable onEdit={openEdit} refreshKey={refreshKey} />

      {showModal && (
        <TambahUniversitasForm
          editItem={editItem}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
