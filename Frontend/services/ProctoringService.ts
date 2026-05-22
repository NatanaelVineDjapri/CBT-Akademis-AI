import api from "./api";

const POIN: Record<string, number> = {
  tab:            5,
  fullscreen:     10,
  copypaste:      8,
  no_face:        10,
  multiple_faces: 20,
  looking_away:   5,
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

export const logPelanggaranWithFoto = (pesertaUjianId: number, tipe: string, foto: Blob): void => {
  const fd = new FormData();
  fd.append("peserta_ujian_id", String(pesertaUjianId));
  fd.append("tipe_pelanggaran", tipe);
  fd.append("risk_score", String(POIN[tipe] ?? 5));
  fd.append("waktu", new Date().toISOString().replace(/\.\d{3}Z$/, "Z"));
  fd.append("foto", foto, "bukti.jpg");
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "";
  fetch(`${base}/proctoring/save-bukti`, {
    method: "POST",
    body: fd,
    credentials: "include",
    headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrf) },
  }).catch(() => {
    logPelanggaran(pesertaUjianId, tipe);
  });
};
