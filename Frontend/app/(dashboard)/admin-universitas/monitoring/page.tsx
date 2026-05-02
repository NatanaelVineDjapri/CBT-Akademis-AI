"use client";
import { useState } from "react";

const data = [
  { id: "01", nama: "PMB versi A", ujian: "Ujian PMB", hari: "Sabtu, 21 Maret 2026", waktu: "10.00 - 12.00" },
  { id: "02", nama: "PMB versi B", ujian: "Ujian PMB", hari: "Sabtu, 21 Maret 2026", waktu: "10.00 - 12.00" },
];

const BookmarkIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function MonitoringPage() {
  const [search, setSearch] = useState("");

  const filtered = data.filter((r) =>
    r.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <p style={{ fontSize: 20  , color: "var(--color-primary)", marginBottom: "1.25rem" }}>
        Home &gt; Monitoring
      </p>
      <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: "var(--color-primary)" }}>Monitoring</span>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 16px 8px 36px",
                border: "1px solid #e5e7eb",
                borderRadius: 999,
                fontSize: 14,
                width: 260,
                outline: "none",
                color: "#000",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: "linear-gradient(135deg, #0d8fa8 0%, var(--color-primary) 60%, #076b88 100%)",
                borderRadius: 12,
                padding: "1rem 1.25rem 1.25rem",
                width: 280,
                position: "relative",
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                <BookmarkIcon />
                <span style={{ fontSize: 15, fontWeight: 600 }}>{item.nama}</span>
              </div>

              <p style={{ fontSize: 14, fontWeight: 400, margin: "0 0 4px" }}>{item.ujian}</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{item.hari}</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{item.waktu}</p>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button
                  style={{
                    background: "#fff",
                    color: "var(--color-primary)",
                    border: "none",
                    borderRadius: 999,
                    padding: "6px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Pantau
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}