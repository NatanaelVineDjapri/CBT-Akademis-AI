"use client";
import { useState } from "react";

const data = [
  { id: "01", nama: "PMB Gel A 2025/2026", tanggal: "21/03/26", pukul: "10.00", status: "On-Going" },
  { id: "02", nama: "PMB Gel B 2025/2026", tanggal: "22/03/26", pukul: "10.00", status: "On-Going" },
];

const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function UjianPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(data);

  const filtered = rows.filter((r) =>
    r.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <p style={{ fontSize: 22, color: "var(--color-primary)", marginBottom: "1.25rem" }}>
        Home &gt; Ujian
      </p>
      <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: 20, fontWeight: 500, color: "var(--color-primary)" }}>Ujian</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px 12px 8px 36px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  width: 180,
                  outline: "none",
                }}
              />
            </div>
            <button style={{ padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, background: "var(--color-primary)", color: "#fff", border: "none", cursor: "pointer" }}>
              Tambah Baru
            </button>
            <button style={{ padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, background: "var(--color-primary)", color: "#fff", border: "none", cursor: "pointer" }}>
              Jadwalkan
            </button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #e5e7eb" }}>
              {["#", "Nama Ujian", "Tanggal", "Pukul", "Status", "Actions"].map((h) => (
                <th key={h} style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", padding: "10px 12px", textAlign: "left" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id} style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}>
                <td style={{ fontSize: 13, color: "var(--background)", padding: "14px 12px" }}>{row.id}</td>
                <td style={{ fontSize: 14, color: "#000000", padding: "14px 12px" }}>{row.nama}</td>
                <td style={{ fontSize: 14, color: "#000000", padding: "14px 12px" }}>{row.tanggal}</td>
                <td style={{ fontSize: 14, color: "#000000", padding: "14px 12px" }}>{row.pukul}</td>
                <td style={{ fontSize: 14, color: "#000000", padding: "14px 12px" }}>{row.status}</td>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: 0 }}>
                      <EditIcon />
                    </button>
                    <button
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 0 }}
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}