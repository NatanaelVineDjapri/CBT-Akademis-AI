"use client";

interface Props {
  terjawab: number;
  totalSoal: number;
  onSubmit: () => void;
  showModal: boolean;
  onConfirmSubmit: () => void;
  onCancelSubmit: () => void;
}

export default function SubmitPanel({ terjawab, totalSoal, onSubmit, showModal, onConfirmSubmit, onCancelSubmit }: Props) {
  const belumDijawab = totalSoal - terjawab;

  return (
    <>
      {/* Panel floating */}
      <div style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#fff",
        borderRadius: 16,
        padding: "16px 20px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        minWidth: 220,
        zIndex: 50,
      }}>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10, textAlign: "center" }}>
          {belumDijawab > 0
            ? `*Terdapat ${belumDijawab} soal yang perlu dikerjakan!`
            : "✓ Semua soal sudah dijawab"}
        </p>
        <button
          onClick={onSubmit}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 50,
            border: "none",
            background: "#097797",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Kumpul Jawaban
        </button>
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: "32px 28px",
            maxWidth: 360,
            width: "90%",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: "#1f2937", marginBottom: 8 }}>
              Yakin ingin mengumpulkan?
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
              Masih ada <strong style={{ color: "#dc2626" }}>{belumDijawab} soal</strong> yang belum dijawab.
              Jawaban tidak dapat diubah setelah dikumpulkan.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onCancelSubmit}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 50,
                  border: "1.5px solid #e5e7eb",
                  background: "#fff",
                  color: "#6b7280",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Kembali
              </button>
              <button
                onClick={onConfirmSubmit}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 50,
                  border: "none",
                  background: "#097797",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Tetap Kumpul
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}