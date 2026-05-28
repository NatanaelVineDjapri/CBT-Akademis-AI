"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Headphones } from "lucide-react";

const ujianData = {
  akanDatang: [
    {
      id: 1,
      nama: "Ujian PMB",
      status: "Sedang Berlangsung",
      tanggal: "20 Maret 2026",
      jamMulai: "08:00",
      jamSelesai: "10:00",
      durasi: 120,
      soal: 40,
    },
  ],
  selesai: [
    {
      id: 2,
      nama: "PMB Gel A 2025/2026",
      status: "Selesai",
      tanggal: "5 Oktober 2025",
      jamMulai: "08:00",
      jamSelesai: "10:00",
      durasi: 90,
      soal: 12,
      nilai: 78,
      grade: "B",
    },
    {
      id: 3,
      nama: "PMB Gel B 2025/2026",
      status: "Selesai",
      tanggal: "10 November 2025",
      jamMulai: "08:00",
      jamSelesai: "10:00",
      durasi: 90,
      soal: 12,
      nilai: 82,
      grade: "B",
    },
  ],
};

export default function UjianPesertaPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof ujianData>("akanDatang");

  const items: any[] = ujianData[activeTab];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      <h1
        style={{
          margin: "0 0 4px",
          fontSize: 22,
          fontWeight: 800,
          color: "var(--color-primary)",
          letterSpacing: "-0.2px",
        }}
      >
        Ujian
      </h1>
      <p style={{ margin: "0 0 22px", fontSize: 13.5, color: "#6b7280" }}>
        Lihat dan kelola semua ujian Anda di sini
      </p>
      <div
        style={{
          display: "inline-flex",
          background: "#ffffff",
          borderRadius: 50,
          padding: 4,
          marginBottom: 24,
          boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
        }}
      >
        {[
          { key: "akanDatang", label: "Akan Datang" },
          { key: "selesai", label: "Selesai" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "9px 28px",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
              background: activeTab === key ? "var(--color-primary)" : "transparent",
              color: activeTab === key ? "#ffffff" : "#9ca3af",
              boxShadow: activeTab === key ? "0 2px 8px rgba(9,119,151,0.25)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {items.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Tidak ada ujian.</p>
        ) : (
          items.map((ujian) => (
            <UjianCard key={ujian.id} ujian={ujian} tab={activeTab} />
          ))
        )}
      </div>
    </div>
  );
}

function UjianCard({ ujian, tab }: { ujian: any; tab: string }) {
  const router = useRouter();

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: "22px 24px 20px",
        width: 280,
        boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Headphones size={22} color="#fff" strokeWidth={2} />
        </div>
        <span
          style={{
            background:
              ujian.status === "Sedang Berlangsung"
                ? "var(--color-primary)"
                : ujian.status === "Akan Datang"
                ? "rgba(9,119,151,0.12)"
                : "rgba(34,197,94,0.12)",
            color:
              ujian.status === "Sedang Berlangsung"
                ? "#fff"
                : ujian.status === "Akan Datang"
                ? "var(--color-primary)"
                : "#16a34a",
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 50,
            padding: "5px 14px",
            whiteSpace: "nowrap",
          }}
        >
          {ujian.status}
        </span>
      </div>
      <h3
        style={{
          margin: "0 0 18px",
          fontSize: 18,
          fontWeight: 800,
          color: "#1f2937",
          lineHeight: 1.3,
        }}
      >
        {ujian.nama}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Calendar size={14} color="#9ca3af" strokeWidth={2} />
          <span style={{ fontSize: 13.5, color: "#6b7280" }}>{ujian.tanggal}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Clock size={14} color="#9ca3af" strokeWidth={2} />
          <span style={{ fontSize: 13.5, color: "#6b7280" }}>
            {ujian.jamMulai} - {ujian.jamSelesai}
          </span>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #f3f4f6", marginBottom: 12 }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: tab === "selesai" ? 10 : 16,
        }}
      >
        <span style={{ fontSize: 13.5, color: "#6b7280" }}>
          Durasi: <strong style={{ color: "#374151" }}>{ujian.durasi} menit</strong>
        </span>
        <span style={{ fontSize: 13.5, color: "#6b7280" }}>
          Soal: <strong style={{ color: "#374151" }}>{ujian.soal}</strong>
        </span>
      </div>
      {tab === "selesai" && ujian.nilai !== undefined && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 13.5, color: "#6b7280" }}>
            Nilai: <strong style={{ color: "var(--color-primary)" }}>{ujian.nilai}</strong>
          </span>
          <span style={{ fontSize: 13.5, color: "#6b7280" }}>
            Grade:{" "}
            <strong style={{ color: "var(--color-primary)" }}>{ujian.grade}</strong>
          </span>
        </div>
      )}
      <button
        onClick={() =>
          tab === "selesai"
            ? router.push(`/pmb/ujian/hasil/${ujian.id}`)
            : router.push(`/pmb/ujian/${ujian.id}`)
        }
        style={{
          width: "100%",
          padding: "10px 0",
          borderRadius: 50,
          border: "none",
          background: "var(--color-primary)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {tab === "selesai" ? "Lihat Hasil" : "Mulai"}
      </button>
    </div>
  );
}