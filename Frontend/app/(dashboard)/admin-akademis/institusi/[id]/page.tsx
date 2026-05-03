"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, ChevronLeft } from "lucide-react";
import { getUniversitasById } from "@/services/UniversitasService";
import { FakultasItem } from "@/services/FakultasService";
import DaftarFakultasTable from "@/components/admin-akademis/DaftarFakultasTable";
import TambahFakultasForm from "@/components/admin-akademis/TambahFakultasForm";

export default function UniversitasDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/admin-akademis/institusi")}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 cursor-pointer"
          >
            <ChevronLeft size={14} />
            Institusi
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
            {univ?.nama ?? "..."}
          </h1>
          {univ && (
            <p className="text-sm text-gray-500 mt-0.5">{univ.kode}{univ.alamat ? ` · ${univ.alamat}` : ""}</p>
          )}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Plus size={16} />
          Tambah Fakultas
        </button>
      </div>

      {id && (
        <DaftarFakultasTable
          universitasId={id}
          onEdit={openEdit}
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
