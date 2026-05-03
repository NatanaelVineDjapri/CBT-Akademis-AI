"use client";

import { useState } from "react";
import Breadcrumb from "@/components/BreadCrumb";
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
      <Breadcrumb />
      <DaftarUniversitasTable onEdit={openEdit} onAdd={openAdd} refreshKey={refreshKey} />

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
