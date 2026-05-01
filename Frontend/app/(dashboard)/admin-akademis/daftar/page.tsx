"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const universities = [
  {
    id: 1,
    name: "Universitas Tarumanagara",
    faculties: [
      { id: "01", name: "Fakultas Ekonomi dan Bisnis", programs: 6 },
      { id: "02", name: "Fakultas Hukum", programs: 3 },
      { id: "03", name: "Fakultas Teknik", programs: 8 },
      { id: "04", name: "Fakultas Kedokteran", programs: 2 },
      { id: "05", name: "Fakultas Teknologi Informasi", programs: 2 },
      { id: "06", name: "Fakultas Seni Rupa dan Desain", programs: 4 },
    ],
  },
  {
    id: 2,
    name: "Universitas Esa Unggul",
    faculties: [
      { id: "01", name: "Fakultas Ilmu Kesehatan", programs: 5 },
      { id: "02", name: "Fakultas Ekonomi dan Bisnis", programs: 4 },
      { id: "03", name: "Fakultas Ilmu Komputer", programs: 3 },
      { id: "04", name: "Fakultas Hukum", programs: 2 },
    ],
  },
  {
    id: 3,
    name: "Universitas Bina Nusantara",
    faculties: [
      { id: "01", name: "School of Computer Science", programs: 5 },
      { id: "02", name: "School of Information Systems", programs: 4 },
      { id: "03", name: "School of Business Management", programs: 6 },
      { id: "04", name: "Faculty of Engineering", programs: 7 },
      { id: "05", name: "School of Design", programs: 3 },
    ],
  },
  {
    id: 4,
    name: "Universitas Bunda Mulia",
    faculties: [
      { id: "01", name: "Fakultas Bisnis", programs: 3 },
      { id: "02", name: "Fakultas Teknologi Informasi", programs: 2 },
      { id: "03", name: "Fakultas Komunikasi", programs: 3 },
    ],
  },
  {
    id: 5,
    name: "Universitas Indonesia",
    faculties: [
      { id: "01", name: "Fakultas Ekonomi dan Bisnis", programs: 6 },
      { id: "02", name: "Fakultas Hukum", programs: 3 },
      { id: "03", name: "Fakultas Teknik", programs: 8 },
      { id: "04", name: "Fakultas Kedokteran", programs: 2 },
      { id: "05", name: "Fakultas Psikologi", programs: 3 },
      { id: "06", name: "Fakultas Ilmu Sosial dan Ilmu Politik", programs: 5 },
      { id: "07", name: "Fakultas Ilmu Pengetahuan Budaya", programs: 4 },
    ],
  },
  {
    id: 6,
    name: "Universitas Multimedia Nusantara",
    faculties: [
      { id: "01", name: "Fakultas Ilmu Komunikasi", programs: 3 },
      { id: "02", name: "Fakultas Teknologi Informasi dan Komunikasi", programs: 4 },
      { id: "03", name: "Fakultas Bisnis", programs: 3 },
      { id: "04", name: "Fakultas Seni dan Desain", programs: 2 },
    ],
  },
  {
    id: 7,
    name: "I3L",
    faculties: [
      { id: "01", name: "School of Applied STEM", programs: 3 },
      { id: "02", name: "School of Informatics and Digital Creative Industry", programs: 2 },
      { id: "03", name: "School of Business", programs: 2 },
    ],
  },
];

const KEYFRAMES = `
  @keyframes dp-dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dp-fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function DaftarPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const selectedUni = universities.find((u) => u.id === selected);
  const filteredFaculties = selectedUni
    ? selectedUni.faculties.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleFacultyClick = (facultyName) => {
    router.push(`/admin-akademis/daftar/${toSlug(facultyName)}`)
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "transparent", color: "black" }}>
      <style>{KEYFRAMES}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, color: "var(--color-primary)", marginBottom: 24, fontWeight: 500 }}>
        <span>Home</span>
        <span>›</span>
        <span>Daftar</span>
      </div>

      <div style={{
        display: "inline-block",
        background: "white",
        borderRadius: 16,
        padding: "16px 20px",
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-primary)", marginBottom: 12 }}>Daftar</div>

        <div style={{ position: "relative", width: 280 }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 13px",
              border: `1.5px solid ${open ? "var(--color-primary)" : "#c8dede"}`,
              borderRadius: 10,
              background: "white",
              fontFamily: "inherit",
              fontSize: 14,
              color: "#6b8080",
              cursor: "pointer",
              boxShadow: open ? "0 0 0 3px rgba(9,119,151,0.12)" : "none",
              outline: "none",
            }}
          >
            <span>{selected ? universities.find((u) => u.id === selected)?.name : "Nama Universitas"}</span>
            <svg
              viewBox="0 0 20 20" fill="none" stroke="#6b8080" strokeWidth="2"
              style={{ width: 16, height: 16, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "white", borderRadius: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              zIndex: 9999, overflow: "hidden",
              animation: "dp-dropIn 0.18s ease",
            }}>
              {universities.map((u, i) => (
                <div
                  key={u.id}
                  onClick={() => { setSelected(u.id); setSearch(""); setOpen(false); }}
                  onMouseEnter={() => setHoveredItem(u.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    padding: "11px 16px",
                    fontSize: 14,
                    color: selected === u.id || hoveredItem === u.id ? "var(--color-primary)" : "black",
                    fontWeight: selected === u.id ? 600 : 400,
                    background: selected === u.id || hoveredItem === u.id ? "var(--color-primary-light)" : "white",
                    cursor: "pointer",
                    borderBottom: i < universities.length - 1 ? "1px solid #f0f5f5" : "none",
                  }}
                >
                  {u.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedUni && (
        <div style={{
          background: "white", borderRadius: 16, padding: "24px 28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          animation: "dp-fadeUp 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-primary)" }}>Daftar Fakultas</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #c8dede", borderRadius: 8, padding: "7px 12px" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#a0b4b4" strokeWidth="2">
                  <circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" />
                </svg>
                <input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "black", background: "transparent", width: 160 }}
                />
              </div>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--color-primary)", color: "white", border: "none",
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

          {filteredFaculties.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e8f0f0" }}>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>#</th>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nama Fakultas</th>
                  <th style={{ textAlign: "center", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>Jumlah Program Studi</th>
                  <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b8080", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculties.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => handleFacultyClick(f.name)}
                    onMouseEnter={() => setHoveredRow(f.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: "1px solid #f0f5f5",
                      background: hoveredRow === f.id ? "var(--color-primary-light)" : "white",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "14px 12px", fontSize: 13, fontWeight: 600, color: "#6b8080", width: 50 }}>{f.id}</td>
                    <td style={{ padding: "14px 12px", fontSize: 14, color: hoveredRow === f.id ? "var(--color-primary)" : "black", fontWeight: hoveredRow === f.id ? 600 : 400 }}>
                      {f.name}
                    </td>
                    <td style={{ padding: "14px 12px", fontSize: 14, fontWeight: 600, color: "var(--color-primary)", textAlign: "center", width: 160 }}>{f.programs}</td>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          title="Edit"
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: 30, height: 30, borderRadius: 7, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-primary-light)", color: "var(--color-primary)" }}
                        >
                          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 3l4 4-9 9H4v-4L13 3z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          title="Hapus"
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: 30, height: 30, borderRadius: 7, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-danger-light)", color: "var(--color-danger)" }}
                        >
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
              <p>Tidak ada fakultas ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}