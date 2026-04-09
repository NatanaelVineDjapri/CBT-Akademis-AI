"use client";

import { useState, useEffect } from "react";
import { getJadwal } from "../../../../services/UserServices";
import type { JadwalEvent } from "@/types";
import JadwalKalender from "../../../../components/kalender/JadwalKalender";
import DetailJadwalModal from "../../../../components/kalender/KalenderDetail";

export default function MahasiswaJadwalPage() {
  const [events, setEvents] = useState<JadwalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<JadwalEvent | null>(null);

  useEffect(() => {
    getJadwal().then(setEvents).catch(() => {});
  }, []);

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Jadwal Ujian</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat jadwal ujian yang akan datang</p>
      </div>

      {/* Kalender */}
      <JadwalKalender
        events={events}
        onEventClick={(event) => setSelectedEvent(event)}
      />

      {/* Modal Detail */}
      <DetailJadwalModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
      
    </div>
  );
}