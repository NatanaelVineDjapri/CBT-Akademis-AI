"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import { getUniversitasById } from "@/services/UniversitasService";
import { FakultasItem } from "@/services/FakultasService";
import DaftarFakultasTable from "@/components/admin-akademis/DaftarFakultasTable";
import TambahFakultasForm from "@/components/admin-akademis/TambahFakultasForm";

export default function UniversitasDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<FakultasItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: univ } = useSWR(
    id ? `/universitas/${id}` : null,
    () => getUniversitasById(id),
    { revalidateOnFocus: false }
  );

  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (item: FakultasItem) => { setEditItem(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };
  const handleSaved = () => setRefreshKey(k => k + 1);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb overrides={{ [String(id)]: univ?.nama ?? "..." }} />

      {id && (
        <DaftarFakultasTable
          universitasId={id}
          univId={id}
          onEdit={openEdit}
          onAdd={openAdd}
          refreshKey={refreshKey}
        />
      )}

      {showModal && (
        <TambahFakultasForm
          universitasId={id}
          editItem={editItem}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
