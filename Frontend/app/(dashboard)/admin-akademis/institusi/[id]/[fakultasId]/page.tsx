"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import { getUniversitasById } from "@/services/UniversitasService";
import { getFakultasById } from "@/services/FakultasService";
import { ProdiItem } from "@/services/ProdiService";
import DaftarProdiTable from "@/components/admin-akademis/DaftarProdiTable";
import TambahProdiForm from "@/components/admin-akademis/TambahProdiForm";

export default function FakultasDetailPage() {
  const params = useParams();
  const univId = Number(params.id);
  const fakultasId = Number(params.fakultasId);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ProdiItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: univ } = useSWR(
    univId ? `/universitas/${univId}` : null,
    () => getUniversitasById(univId),
    { revalidateOnFocus: false }
  );

  const { data: fakultas } = useSWR(
    fakultasId ? `/fakultas/${fakultasId}` : null,
    () => getFakultasById(fakultasId),
    { revalidateOnFocus: false }
  );

  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (item: ProdiItem) => { setEditItem(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };
  const handleSaved = () => setRefreshKey(k => k + 1);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb
        overrides={{
          [String(univId)]: univ?.nama ?? "...",
          [String(fakultasId)]: fakultas?.nama ?? "...",
        }}
      />

      {fakultasId && (
        <DaftarProdiTable
          fakultasId={fakultasId}
          onEdit={openEdit}
          onAdd={openAdd}
          refreshKey={refreshKey}
        />
      )}

      {showModal && (
        <TambahProdiForm
          fakultasId={fakultasId}
          editItem={editItem}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
