"use client";
import { Calendar, Clock } from "lucide-react";

interface Props {
  namaUjian: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  timeLeft: number;
  terjawab: number;
  totalSoal: number;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function ExamHeader({ namaUjian, tanggal, jamMulai, jamSelesai, timeLeft, terjawab, totalSoal }: Props) {
  const isWarning = timeLeft < 600;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "18px 24px",
      marginBottom: 16,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: 17, color: "#097797", marginBottom: 6 }}>
          {namaUjian}
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 13 }}>
            <Calendar size={13} /> {tanggal}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 13 }}>
            <Clock size={13} /> {jamMulai} – {jamSelesai}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Terjawab</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "#097797" }}>
            {terjawab}/{totalSoal}
          </div>
        </div>
        <div style={{
          background: isWarning ? "#fff1f0" : "#fff8f0",
          border: `1.5px solid ${isWarning ? "#fca5a5" : "#fed7aa"}`,
          borderRadius: 12,
          padding: "10px 20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Waktu Tersisa</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: isWarning ? "#dc2626" : "#ea580c", letterSpacing: 1 }}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </div>
  );
}