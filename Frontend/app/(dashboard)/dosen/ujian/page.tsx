"use client";
import { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";

const initialData = [
  {
    id: "01",
    nama: "Bahasa Indonesia A",
    tanggal: "20/03/26",
    pukul: "12.00",
    jenis: "PMB",
    status: "On-Going",
  },
  {
    id: "02",
    nama: "Bahasa Indonesia B",
    tanggal: "20/03/26",
    pukul: "13.00",
    jenis: "Perkuliahan",
    status: "Belum Berlansung",
  },
];

export default function UjianPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    tanggal: "",
    pukul: "",
    jenis: "",
    status: "Belum Berlansung",
  });

  const filtered = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.jenis.toLowerCase().includes(search.toLowerCase()) ||
      d.status.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm({ nama: "", tanggal: "", pukul: "", jenis: "", status: "Belum Berlansung" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditTarget(item.id);
    setForm({ nama: item.nama, tanggal: item.tanggal, pukul: item.pukul, jenis: item.jenis, status: item.status });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSave = () => {
    if (!form.nama || !form.tanggal || !form.pukul || !form.jenis) return;
    if (editTarget) {
      setData((prev) =>
        prev.map((d) => (d.id === editTarget ? { ...d, ...form } : d))
      );
    } else {
      const newId = String(data.length + 1).padStart(2, "0");
      setData((prev) => [...prev, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ color: "var(--color-primary)", cursor: "pointer" }}>Home</span>
        <span style={{ color: "var(--color-primary)", fontWeight: 400 }}>&gt;</span>
        <span style={{ color: "var(--color-primary)" }}>Ujian</span>
      </div>
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          padding: "28px 32px",
          minHeight: 400,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: "var(--color-primary)",
              letterSpacing: "-0.2px",
            }}
          >
            Ujian
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1.5px solid #d1d5db",
                borderRadius: 50,
                padding: "8px 18px",
                background: "#fff",
                minWidth: 200,
              }}
            >
              <Search size={15} color="#9ca3af" strokeWidth={2.5} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: "#374151",
                  background: "transparent",
                  width: "100%",
                }}
              />
            </div>
            <button
              onClick={openAdd}
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 50,
                padding: "10px 24px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Tambah Baru
            </button>
            <button
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 50,
                padding: "10px 24px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Jadwalkan
            </button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #e5e7eb" }}>
              {[
                { label: "#", w: "5%" },
                { label: "Nama Ujian", w: "22%" },
                { label: "Tanggal", w: "14%" },
                { label: "Pukul", w: "12%" },
                { label: "Jenis Ujian", w: "16%" },
                { label: "Status", w: "18%" },
                { label: "Actions", w: "13%" },
              ].map(({ label, w }) => (
                <th
                  key={label}
                  style={{
                    textAlign: "left",
                    padding: "0 12px 14px",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: 13.5,
                    width: w,
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px 12px", color: "#9ca3af", fontSize: 14 }}>
                  Tidak ada data ujian.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? "1.5px solid #e5e7eb" : "none",
                  }}
                >
                  <td style={{ padding: "18px 12px", color: "#9ca3af", fontSize: 14, fontWeight: 600 }}>
                    {item.id}
                  </td>
                  <td style={{ padding: "18px 12px", fontWeight: 700, color: "#374151", fontSize: 14 }}>
                    {item.nama}
                  </td>
                  <td style={{ padding: "18px 12px", color: "#6b7280", fontSize: 14 }}>
                    {item.tanggal}
                  </td>
                  <td style={{ padding: "18px 12px", color: "#6b7280", fontSize: 14 }}>
                    {item.pukul}
                  </td>
                  <td style={{ padding: "18px 12px", color: "#6b7280", fontSize: 14 }}>
                    {item.jenis}
                  </td>
                  <td style={{ padding: "18px 12px", color: "#6b7280", fontSize: 14 }}>
                    {item.status}
                  </td>
                  <td style={{ padding: "18px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        onClick={() => openEdit(item)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        title="Edit"
                      >
                        <Pencil size={17} color="var(--color-primary)" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        title="Hapus"
                      >
                        <Trash2 size={17} color="var(--color-danger)" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "32px 32px 28px",
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 22px", fontSize: 17, fontWeight: 800, color: "var(--color-primary)" }}>
              {editTarget ? "Edit Ujian" : "Tambah Ujian Baru"}
            </h3>

            {[
              { label: "Nama Ujian", key: "nama", placeholder: "e.g. Bahasa Indonesia A" },
              { label: "Tanggal", key: "tanggal", placeholder: "DD/MM/YY" },
              { label: "Pukul", key: "pukul", placeholder: "e.g. 12.00" },
              { label: "Jenis Ujian", key: "jenis", placeholder: "e.g. PMB / Perkuliahan" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 5 }}>
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "9px 13px",
                    border: "1.5px solid #d1d5db",
                    borderRadius: 10,
                    fontSize: 13.5,
                    outline: "none",
                    color: "#1f2937",
                    background: "#fff",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.border = "1.5px solid var(--color-primary)")}
                  onBlur={(e) => (e.target.style.border = "1.5px solid #d1d5db")}
                />
              </div>
            ))}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 5 }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "9px 13px",
                  border: "1.5px solid #d1d5db",
                  borderRadius: 10,
                  fontSize: 13.5,
                  outline: "none",
                  color: "#1f2937",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <option>Belum Berlansung</option>
                <option>On-Going</option>
                <option>Selesai</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "9px 22px",
                  borderRadius: 50,
                  border: "1.5px solid #d1d5db",
                  background: "transparent",
                  color: "#6b7280",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "9px 24px",
                  borderRadius: 50,
                  background: "var(--color-primary)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {editTarget ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}