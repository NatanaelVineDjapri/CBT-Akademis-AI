"use client";

import { useState } from "react";
import useSWR from "swr";
import { getJadwalDosen } from "../../../../services/UserServices";
import JadwalKalender from "../../../../components/kalender/JadwalKalender";
import DetailJadwalModal from "../../../../components/kalender/KalenderDetail";
import Breadcrumb from "../../../../components/BreadCrumb";
import type { JadwalEvent } from "@/types";

export default function DosenJadwalPage() {
  const [selectedEvent, setSelectedEvent] = useState<JadwalEvent | null>(null);
  const { data: events = [] } = useSWR("/jadwal/dosen", getJadwalDosen, { revalidateOnFocus: false });

  return (
    <div className="flex flex-col gap-2 pb-4">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <JadwalKalender
        events={events}
        onEventClick={(event) => setSelectedEvent(event)}
      />

      {/* <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-start gap-3">
        <TriangleAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Jadwal yang ditampilkan adalah ujian yang Anda buat. Pastikan jadwal ujian sudah sesuai sebelum peserta mengerjakan.
        </p>
      </div> */}

      <DetailJadwalModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
