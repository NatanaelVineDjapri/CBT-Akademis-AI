"use client";
import { useState } from "react";

export default function AdminPage() {
  const [maintenanceOn, setMaintenanceOn] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <p style={{ color: "var(--color-primary)", fontSize: "1.1rem", marginBottom: 2 }}>Hello</p>
        <p style={{ color: "var(--color-primary)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          Welcome back Nama!
        </p>
      </div>

      <div style={{ background: "#ffffff", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: "0.75rem", borderBottom: "1px solid var(--calendar-border-color)", marginBottom: "1rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-primary)" }}>Maintenance Break</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--calendar-day-number-color)", marginBottom: "0.75rem" }}>
          Mengaktifkan mode Maintenance Break akan menonaktifkan sementara seluruh akses dan fitur sistem bagi pengguna.
        </p>
        <button
          onClick={() => setMaintenanceOn(!maintenanceOn)}
          style={{
            background: maintenanceOn ? "var(--color-danger)" : "var(--color-primary)",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Maintenance: {maintenanceOn ? "ON" : "OFF"}
        </button>
      </div>

      <div style={{ background: "#ffffff", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: "0.75rem", borderBottom: "1px solid var(--calendar-border-color)", marginBottom: "1rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-primary)" }}>Pengumuman</span>
        </div>
        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          style={{
            width: "100%",
            border: "1px solid var(--calendar-border-color)",
            borderRadius: 8,
            padding: "10px 12px",
            minHeight: 80,
            fontSize: "0.875rem",
            marginBottom: "0.75rem",
            fontFamily: "inherit",
            resize: "vertical",
            background: "#ffffff",
            color: "#374151",
            outline: "none",
          }}
        />
        <button style={{
          background: "var(--color-primary)",
          color: "#ffffff",
          border: "none",
          borderRadius: 8,
          padding: "8px 20px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "0.85rem",
        }}>
          Unggah
        </button>
      </div>
    </div>
  );
}