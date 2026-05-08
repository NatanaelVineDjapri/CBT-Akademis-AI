"use client";

interface Props {
  totalSoal: number;
  answers: Record<number, string>;
  currentQ: number;
  onSelect: (q: number) => void;
}

export default function QuestionNav({ totalSoal, answers, currentQ, onSelect }: Props) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "18px 24px",
      marginBottom: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: "#097797", marginBottom: 14 }}>
        Navigasi Soal
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {Array.from({ length: totalSoal }, (_, i) => {
          const num = i + 1;
          const isActive = currentQ === num;
          const isAnswered = !!answers[num];

          return (
            <button
              key={num}
              onClick={() => onSelect(num)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
                transition: "all 0.15s",
                background: isActive
                  ? "#097797"
                  : isAnswered
                  ? "#e0f5f0"
                  : "#f3f4f6",
                color: isActive
                  ? "#fff"
                  : isAnswered
                  ? "#097797"
                  : "#6b7280",
                outline: isActive ? "2px solid #097797" : "none",
                outlineOffset: 2,
              }}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        {[
          { color: "#097797", bg: "#097797", label: "Sedang dilihat" },
          { color: "#097797", bg: "#e0f5f0", label: "Sudah dijawab" },
          { color: "#6b7280", bg: "#f3f4f6", label: "Belum dijawab" },
        ].map(({ color, bg, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af" }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1px solid ${color}` }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}