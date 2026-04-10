"use client";

import { useState } from "react";
import useSWR from "swr";
import { getJadwal } from "../../../../services/UserServices";
import JadwalKalender from "../../../../components/kalender/JadwalKalender";
import DetailJadwalModal from "../../../../components/kalender/KalenderDetail";
import type { JadwalEvent } from "@/types";

export default function MahasiswaJadwalPage() {
  const [selectedEvent, setSelectedEvent] = useState<JadwalEvent | null>(null);
  const { data: events = [] } = useSWR("/jadwal", getJadwal, { revalidateOnFocus: false });

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Jadwal Ujian</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat jadwal ujian yang akan datang</p>
      </div>

      <JadwalKalender
        events={events}
        onEventClick={(event) => setSelectedEvent(event)}
      />

      <DetailJadwalModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
