"use client";
import { useState, useEffect } from "react";
import ExamHeader from "./ExamHeader";
import QuestionNav from "./QuestionNav";
import QuestionCard from "./QuestionCard";
import SubmitPanel from "./SubmitPanel";

const DUMMY_UJIAN = {
  id: "1",
  nama: "Ujian PMB",
  tanggal: "20 Maret 2026",
  jamMulai: "08:00",
  jamSelesai: "10:00",
  durasi: 120,
  totalSoal: 40,
};

const DUMMY_SOAL = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  pertanyaan: `Sederhanakan bentuk aljabar berikut: ${i + 1}x + 5 – 2x + 7 – x`,
  pilihan: [
    { key: "A", teks: `${i + 1}x + 12` },
    { key: "B", teks: "12" },
    { key: "C", teks: `${i * 2}x + 12` },
    { key: "D", teks: `x + ${i + 2}` },
  ],
}));

interface Props {
  ujianId: string;
}

export default function ExamShell({ ujianId }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(1);
  const [timeLeft, setTimeLeft] = useState(DUMMY_UJIAN.durasi * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const handleAnswer = (soalId: number, pilihan: string) => {
    setAnswers((prev) => ({ ...prev, [soalId]: pilihan }));
  };

  const handleSubmit = (auto = false) => {
    const belumDijawab = DUMMY_UJIAN.totalSoal - Object.keys(answers).length;
    if (!auto && belumDijawab > 0) {
      setShowSubmitModal(true);
      return;
    }
    alert("Jawaban dikumpulkan!");
  };

  const soalSekarang = DUMMY_SOAL[currentQ - 1];
  const totalHalaman = DUMMY_UJIAN.totalSoal;

  return (
    <div style={{ minHeight: "100vh", background: "transparent", padding: "20px 24px", fontFamily: "'Nunito', sans-serif" }}>
      
      <ExamHeader
        namaUjian={DUMMY_UJIAN.nama}
        tanggal={DUMMY_UJIAN.tanggal}
        jamMulai={DUMMY_UJIAN.jamMulai}
        jamSelesai={DUMMY_UJIAN.jamSelesai}
        timeLeft={timeLeft}
        terjawab={Object.keys(answers).length}
        totalSoal={DUMMY_UJIAN.totalSoal}
      />

      <QuestionNav
        totalSoal={DUMMY_UJIAN.totalSoal}
        answers={answers}
        currentQ={currentQ}
        onSelect={setCurrentQ}
      />

      <QuestionCard
        soal={soalSekarang}
        currentQ={currentQ}
        totalSoal={totalHalaman}
        selectedAnswer={answers[currentQ]}
        onAnswer={handleAnswer}
        onNext={() => setCurrentQ((q) => Math.min(q + 1, totalHalaman))}
        onPrev={() => setCurrentQ((q) => Math.max(q - 1, 1))}
      />

      <SubmitPanel
        terjawab={Object.keys(answers).length}
        totalSoal={DUMMY_UJIAN.totalSoal}
        onSubmit={() => handleSubmit(false)}
        showModal={showSubmitModal}
        onConfirmSubmit={() => { setShowSubmitModal(false); handleSubmit(true); }}
        onCancelSubmit={() => setShowSubmitModal(false)}
      />
    </div>
  );
}