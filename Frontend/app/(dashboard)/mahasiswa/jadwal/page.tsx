"use client";

import { useState } from "react";
import useSWR from "swr";
import { TriangleAlert } from "lucide-react";
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

      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-start gap-3">
        <TriangleAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Selalu pantau jadwal ujian Anda secara berkala. Perubahan jadwal dapat terjadi sewaktu-waktu dan menjadi tanggung jawab mahasiswa untuk memastikan kehadiran tepat waktu.
        </p>
      </div>

      <DetailJadwalModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
