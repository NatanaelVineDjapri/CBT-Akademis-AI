import api from "./api";

const POIN: Record<string, number> = {
  tab:        5,
  fullscreen: 10,
  copypaste:  8,
};

export const logPelanggaran = (pesertaUjianId: number, tipe: string): void => {
  api.post("/proctoring/save", {
    peserta_ujian_id: pesertaUjianId,
    events: [{
      tipe_pelanggaran: tipe,
      risk_score: POIN[tipe] ?? 5,
      waktu: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    }],
  }).catch(() => {});
};
