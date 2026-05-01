"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const prodiData = {
  "fakultas-ekonomi-dan-bisnis": {
    label: "Fakultas Ekonomi dan Bisnis",
    prodi: [
      { id: "01", name: "S1 Manajemen", mataKuliah: 52 },
      { id: "02", name: "S1 Akuntansi", mataKuliah: 48 },
      { id: "03", name: "S1 Ekonomi Pembangunan", mataKuliah: 46 },
      { id: "04", name: "S2 Manajemen", mataKuliah: 30 },
      { id: "05", name: "S2 Akuntansi", mataKuliah: 28 },
      { id: "06", name: "S3 Ilmu Ekonomi", mataKuliah: 20 },
    ],
  },
  "fakultas-hukum": {
    label: "Fakultas Hukum",
    prodi: [
      { id: "01", name: "S1 Ilmu Hukum", mataKuliah: 50 },
      { id: "02", name: "S2 Hukum", mataKuliah: 28 },
      { id: "03", name: "S3 Hukum", mataKuliah: 18 },
    ],
  },
  "fakultas-teknik": {
    label: "Fakultas Teknik",
    prodi: [
      { id: "01", name: "S1 Teknik Informatika", mataKuliah: 50 },
      { id: "02", name: "S1 Sistem Informasi", mataKuliah: 50 },
      { id: "03", name: "S1 Teknik Sipil", mataKuliah: 48 },
      { id: "04", name: "S1 Teknik Mesin", mataKuliah: 48 },
      { id: "05", name: "S1 Teknik Elektro", mataKuliah: 46 },
      { id: "06", name: "S1 Teknik Industri", mataKuliah: 46 },
      { id: "07", name: "S2 Teknik Informatika", mataKuliah: 28 },
      { id: "08", name: "S2 Teknik Sipil", mataKuliah: 26 },
    ],
  },
  "fakultas-teknologi-informasi": {
    label: "Fakultas Teknologi Informasi",
    prodi: [
      { id: "01", name: "S1 Teknik Informatika", mataKuliah: 50 },
      { id: "02", name: "S1 Sistem Informasi", mataKuliah: 50 },
    ],
  },
  "school-of-computer-science": {
    label: "School of Computer Science",
    prodi: [
      { id: "01", name: "S1 Computer Science", mataKuliah: 52 },
      { id: "02", name: "S1 Mobile Application and Technology", mataKuliah: 48 },
      { id: "03", name: "S1 Cyber Security", mataKuliah: 46 },
      { id: "04", name: "S2 Computer Science", mataKuliah: 30 },
      { id: "05", name: "S3 Computer Science", mataKuliah: 20 },
    ],
  },
};

// Fallback untuk slug yang belum terdefinisi
function getFacultyData(slug) {
  if (prodiData[slug]) return prodiData[slug];
  // Generate label dari slug
  const label = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    label,
    prodi: [
      { id: "01", name: "S1 Program Studi 1", mataKuliah: 50 },
      { id: "02", name: "S1 Program Studi 2", mataKuliah: 50 },
    ],
  };
}

const KEYFRAMES = `
  @keyframes dp-fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function DaftarProdiPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.fakultas;

  const { label, prodi } = getFacultyData(slug);

  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = prodi.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "transparent", color: "#1a2e2e" }}>
      <style>{KEYFRAMES}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, color: "#097797", marginBottom: 24, fontWeight: 500 }}>
        <span style={{ cursor: "pointer" }} onClick={() => router.push("/")}>Home</span>
        <span style={{ color: "#097797" }}>›</span>
        <span style={{ cursor: "pointer" }} onClick={() => router.push("/admin-akademis/daftar")}></span>
        <span style={{ color: "#097797" }}>›</span>
        <span style={{ color: "#097797" }}>Daftar Prodi</span>
      </div>

      <div style={{
        background: "white", borderRadius: 16, padding: "24px 28px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        animation: "dp-fadeUp 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0d7b7b" }}>Daftar Prodi</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #c8dede", borderRadius: 8, padding: "7px 12px" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#a0b4b4" strokeWidth="2">
                <circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" />
              </svg>
              <input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "#1a2e2e", background: "transparent", width: 160 }}
              />
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#0d9b9b", color: "white", border: "none",
              borderRadius: 8, padding: "8px 16px", fontFamily: "inherit",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10 4v12M4 10h12" strokeLinecap="round" />
              </svg>
              Tambah Baru
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e8f0f0" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>#</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nama Program Studi</th>
                <th style={{ textAlign: "center", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>Jumlah Mata Kuliah</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onMouseEnter={() => setHoveredRow(p.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ borderBottom: "1px solid #f0f5f5", background: hoveredRow === p.id ? "#f7fbfb" : "white" }}
                >
                  <td style={{ padding: "14px 12px", fontSize: 13, fontWeight: 600, color: "#6b8080", width: 50 }}>{p.id}</td>
                  <td style={{ padding: "14px 12px", fontSize: 14, color: "#1a2e2e" }}>{p.name}</td>
                  <td style={{ padding: "14px 12px", fontSize: 14, fontWeight: 600, color: "#0d7b7b", textAlign: "center", width: 160 }}>{p.mataKuliah}</td>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button title="Edit" style={{ width: 30, height: 30, borderRadius: 7, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "#e8f5f5", color: "#0d9b9b" }}>
                        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 3l4 4-9 9H4v-4L13 3z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button title="Hapus" style={{ width: 30, height: 30, borderRadius: 7, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffeaea", color: "#e05555" }}>
                        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 6h12M8 6V4h4v2M7 6l1 10h4l1-10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "#6b8080", fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>🔍</div>
            <p>Tidak ada program studi ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
