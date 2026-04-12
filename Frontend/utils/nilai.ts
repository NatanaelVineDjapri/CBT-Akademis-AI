export function getBarColor(nilai: number) {
  if (nilai >= 80) return "var(--color-primary, #097797)";
  if (nilai >= 65) return "var(--color-warning, #f59e0b)";
  return "var(--color-danger, #ef4444)";
}

export function getInsight(nilai: number, nama: string) {
  if (nilai >= 80)
    return { text: `Pertahankan performa di ${nama}!`, icon: "↑" };
  if (nilai >= 65)
    return { text: `Tingkatkan belajar untuk ${nama}.`, icon: "!" };
  return { text: `Perlu perhatian lebih di ${nama}.`, icon: "↓" };
}
