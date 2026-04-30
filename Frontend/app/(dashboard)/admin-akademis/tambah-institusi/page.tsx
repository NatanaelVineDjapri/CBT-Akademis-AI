"use client";
import { useState } from "react";
import { GraduationCap, Search, Pencil, Trash2 } from "lucide-react";

const initialData = [
  { id: 1, nama: "Universitas Tarumanagara", jenis: "Universitas" },
  { id: 2, nama: "Universitas Esa Unggul", jenis: "Universitas" },
  { id: 3, nama: "Universitas Bina Nusantara", jenis: "Universitas" },
];

export default function TambahInstitusi() {
  const [form, setForm] = useState({ nama: "", jenis: "", alamat: "", kota: "" });
  const [list, setList] = useState(initialData);
  const [search, setSearch] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.nama || !form.jenis) return;
    setList([...list, { id: Date.now(), nama: form.nama, jenis: form.jenis }]);
    setForm({ nama: "", jenis: "", alamat: "", kota: "" });
  };

  const handleDelete = (id) => setList(list.filter((i) => i.id !== id));

  const filtered = list.filter(
    (i) =>
      i.nama.toLowerCase().includes(search.toLowerCase()) ||
      i.jenis.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = (name) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    padding: "11px 14px",
    border: `1.5px solid ${focusedInput === name ? "#0d9488" : "#e5e7eb"}`,
    borderRadius: 10,
    color: focusedInput === name ? "#1e293b" : "#6b7280",
    outline: "none",
    background: focusedInput === name ? "#fff" : "#fafafa",
    boxShadow: focusedInput === name ? "0 0 0 3px rgba(13,148,136,0.12)" : "none",
    transition: "all 0.2s",
    width: "100%",
    boxSizing: "border-box",
  });

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <p style={styles.breadcrumb}>
        Home{" "}
        <span style={{ color: "#9ca3af", margin: "0 4px" }}>&gt;</span>{" "}
        <span style={styles.breadcrumbActive}>Tambah Institusi</span>
      </p>

      {/* Form Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.iconBox}>
            <GraduationCap size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={styles.cardTitle}>Tambah Institusi</span>
        </div>
        <hr style={styles.divider} />

        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Institusi</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Universitas ABC"
              style={inputStyle("nama")}
              onFocus={() => setFocusedInput("nama")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Jenis Institusi</label>
            <input
              name="jenis"
              value={form.jenis}
              onChange={handleChange}
              placeholder="Universitas"
              style={inputStyle("jenis")}
              onFocus={() => setFocusedInput("jenis")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>

          <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Alamat</label>
            <input
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Jakarta Barat Timur Raya Tengah Pusat Utara, blok 123 huaisjd"
              style={inputStyle("alamat")}
              onFocus={() => setFocusedInput("alamat")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Kota / Provinsi</label>
            <input
              name="kota"
              value={form.kota}
              onChange={handleChange}
              placeholder="Jakarta Barat"
              style={inputStyle("kota")}
              onFocus={() => setFocusedInput("kota")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
        </div>

        <button style={styles.btnPrimary} onClick={handleSubmit}>
          Tambahkan Institusi
        </button>
      </div>

      {/* Table Card */}
      <div style={styles.card}>
        <div style={styles.tableHeader}>
          <span style={styles.tableTitle}>Daftar Institusi</span>
          <div style={styles.searchWrap}>
            <Search size={14} color="#9ca3af" style={styles.searchIcon} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              style={{
                ...inputStyle("search"),
                paddingLeft: 34,
                width: 220,
                fontSize: 13,
              }}
              onFocus={() => setFocusedInput("search")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: 50 }}>#</th>
              <th style={styles.th}>Nama Institusi</th>
              <th style={{ ...styles.th, width: 160 }}>Jenis Institusi</th>
              <th style={{ ...styles.th, width: 90 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr
                key={row.id}
                style={styles.tr}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fffe")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ ...styles.td, color: "#9ca3af", fontWeight: 600, fontSize: 13 }}>
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td style={styles.td}>{row.nama}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>{row.jenis}</span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ ...styles.btnIcon, ...styles.btnEdit }}>
                      <Pencil size={14} color="#0d9488" />
                    </button>
                    <button
                      style={{ ...styles.btnIcon, ...styles.btnDelete }}
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 size={14} color="#dc2626" />
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

const styles = {
  page: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    padding: "28px 32px",
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  breadcrumb: {
    fontSize: 14,
    color: "#0d9488",
    fontWeight: 500,
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
  },
  breadcrumbActive: { color: "#0d9488" },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  iconBox: {
    width: 34,
    height: 34,
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e293b",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #f1f5f9",
    marginBottom: 24,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 24,
  },
  formGroup: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 14, fontWeight: 600, color: "#374151" },

  btnPrimary: {
    padding: "11px 26px",
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },

  tableHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tableTitle: { fontSize: 16, fontWeight: 700, color: "#0d9488" },
  searchWrap: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 11, pointerEvents: "none", zIndex: 1 },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: 12,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "10px 14px",
    borderBottom: "1.5px solid #f1f5f9",
    textAlign: "left",
  },
  tr: { transition: "background 0.15s" },
  td: {
    fontSize: 14,
    color: "#374151",
    padding: "15px 14px",
    borderBottom: "1px solid #f1f5f9",
    fontWeight: 500,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 12,
    fontWeight: 600,
    color: "#0d9488",
    background: "#f0fdf9",
    padding: "4px 12px",
    borderRadius: 20,
    border: "1px solid #ccfbf1",
  },
  btnIcon: {
    width: 32,
    height: 32,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s",
  },
  btnEdit: { background: "#f0fdf9" },
  btnDelete: { background: "#fff1f2" },
};