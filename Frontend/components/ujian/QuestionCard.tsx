"use client";

interface Pilihan {
  key: string;
  teks: string;
}

interface Soal {
  id: number;
  pertanyaan: string;
  pilihan: Pilihan[];
}

interface Props {
  soal: Soal;
  currentQ: number;
  totalSoal: number;
  selectedAnswer?: string;
  onAnswer: (soalId: number, pilihan: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function QuestionCard({ soal, currentQ, totalSoal, selectedAnswer, onAnswer, onNext, onPrev }: Props) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "22px 24px",
      marginBottom: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontWeight: 800, fontSize: 16, color: "#097797", marginBottom: 10 }}>
        Soal {currentQ} dari {totalSoal}
      </div>
      <p style={{ fontSize: 15, color: "#374151", marginBottom: 20, lineHeight: 1.6 }}>
        {soal.pertanyaan}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {soal.pilihan.map((p) => {
          const isSelected = selectedAnswer === p.key;
          return (
            <button
              key={p.key}
              onClick={() => onAnswer(soal.id, p.key)}
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                border: `1.5px solid ${isSelected ? "#097797" : "#e5e7eb"}`,
                background: isSelected ? "#e0f5f0" : "#fff",
                color: isSelected ? "#097797" : "#374151",
                fontWeight: isSelected ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              {p.key}. {p.teks}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>
          Halaman {currentQ} dari {totalSoal}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {currentQ > 1 && (
            <button
              onClick={onPrev}
              style={{
                padding: "9px 22px",
                borderRadius: 50,
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                color: "#6b7280",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Sebelumnya
            </button>
          )}
          {currentQ < totalSoal && (
            <button
              onClick={onNext}
              style={{
                padding: "9px 22px",
                borderRadius: 50,
                border: "none",
                background: "#097797",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Selanjutnya
            </button>
          )}
        </div>
      </div>
    </div>
  );
}