import api from "./api";
import * as XLSX from "xlsx";
import { UjianMahasiswa, UjianMeta, HasilUjianDosenItem, HasilUjianDosenDetail, DetailPesertaDosen, UjianSession } from "../types";

export const getActiveSession = async (): Promise<{ peserta_ujian_id: number; nama_ujian: string } | null> => {
  const res = await api.get("/ujian/active-session");
  return res.data.active;
};

export const mulaiUjian = async (pesertaUjianId: number, kodeAkses?: string): Promise<UjianSession> => {
  const res = await api.post(`/ujian/${pesertaUjianId}/mulai`, kodeAkses ? { kode_akses: kodeAkses } : {});
  return res.data.data;
};

export const submitJawabanSoal = async (pesertaUjianId: number, ujianSoalId: number, jawaban: string): Promise<void> => {
  await api.post("/ujian/submit-jawaban", { peserta_ujian_id: pesertaUjianId, ujian_soal_id: ujianSoalId, jawaban });
};

export const selesaikanUjian = async (pesertaUjianId: number): Promise<void> => {
  await api.post("/ujian/selesai", { peserta_ujian_id: pesertaUjianId });
};

export const getMyUjian = async (params?: {
  search?: string;
  status?: string;
  sort_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
}): Promise<{ data: UjianMahasiswa[]; meta: UjianMeta }> => {
  const res = await api.get("/ujian/my", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const getDetailUjianDosen = async (id: number | string): Promise<HasilUjianDosenDetail> => {
  const res = await api.get(`/ujian/dosen/hasil/${id}`);
  return { info: res.data.info, peserta: res.data.peserta, distribusi: res.data.distribusi };
};

export const getDetailPesertaDosen = async (ujianId: string | number, pesertaId: string | number): Promise<DetailPesertaDosen> => {
  const res = await api.get(`/ujian/dosen/hasil/${ujianId}/peserta/${pesertaId}`);
  return { info: res.data.info, jawaban: res.data.jawaban };
};

export const resetEssay = async (
  ujianId: string | number,
  pesertaId: string | number,
): Promise<void> => {
  await api.put(`/ujian/dosen/hasil/${ujianId}/peserta/${pesertaId}/reset-essay`);
};

export const periksaEssay = async (
  ujianId: string | number,
  pesertaId: string | number,
  penilaian: { id: number; nilai: number; dosen_feedback?: string }[]
): Promise<void> => {
  await api.put(`/ujian/dosen/hasil/${ujianId}/peserta/${pesertaId}/periksa-essay`, { penilaian });
};

export const exportHasilUjianPDF = async (id: string | number): Promise<void> => {
  const res = await api.get(`/ujian/dosen/hasil/${id}/export-pdf`, { responseType: "blob" });
  const disposition = res.headers["content-disposition"] as string | undefined;
  const match = disposition?.match(/filename="?([^";\n]+)"?/);
  const filename = match?.[1] ?? `hasil-ujian-${id}.pdf`;
  const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportHasilUjianExcel = (data: HasilUjianDosenDetail, namaUjian: string): void => {
  const { info, peserta } = data;

  const infoRows = [
    ["Nama Ujian", info.nama_ujian],
    ["Mata Kuliah", info.mata_kuliah],
    ["Tanggal", info.tanggal],
    ["Jenis Ujian", info.jenis_ujian],
    ["Total Peserta", info.total_peserta],
    ["Total Soal", info.total_soal],
    [],
  ];

  const header = ["No", "NIM", "Nama Mahasiswa", "Nilai", "Grade", "Status"];
  const rows = peserta.map((p, i) => [
    i + 1,
    p.nim ?? "-",
    p.nama,
    p.nilai ?? "-",
    p.grade ?? "-",
    p.nilai === null ? "-" : p.lulus ? "Lulus" : "Tidak Lulus",
  ]);

  const ws = XLSX.utils.aoa_to_sheet([...infoRows, header, ...rows]);

  ws["!cols"] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 28 },
    { wch: 8 },
    { wch: 8 },
    { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Hasil Ujian");

  const slug = namaUjian.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  XLSX.writeFile(wb, `hasil-ujian-${slug}.xlsx`);
};

export const getHasilUjianAdminUniversitas = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}): Promise<{ data: HasilUjianDosenItem[]; meta: UjianMeta }> => {
  const res = await api.get("/ujian/admin-universitas/hasil", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const getDetailUjianAdminUniversitas = async (id: number | string): Promise<HasilUjianDosenDetail> => {
  const res = await api.get(`/ujian/admin-universitas/hasil/${id}`);
  return { info: res.data.info, peserta: res.data.peserta, distribusi: res.data.distribusi };
};

export const getDetailPesertaAdminUniversitas = async (ujianId: string | number, pesertaId: string | number): Promise<DetailPesertaDosen> => {
  const res = await api.get(`/ujian/admin-universitas/hasil/${ujianId}/peserta/${pesertaId}`);
  return { info: res.data.info, jawaban: res.data.jawaban };
};

export const periksaEssayAdminUniversitas = async (
  ujianId: string | number,
  pesertaId: string | number,
  penilaian: { id: number; nilai: number; dosen_feedback?: string }[]
): Promise<void> => {
  await api.put(`/ujian/admin-universitas/hasil/${ujianId}/peserta/${pesertaId}/periksa-essay`, { penilaian });
};

export const resetEssayAdminUniversitas = async (
  ujianId: string | number,
  pesertaId: string | number,
): Promise<void> => {
  await api.put(`/ujian/admin-universitas/hasil/${ujianId}/peserta/${pesertaId}/reset-essay`);
};

export const exportHasilUjianPMBPDF = async (id: string | number): Promise<void> => {
  const res = await api.get(`/ujian/admin-universitas/hasil/${id}/export-pdf`, { responseType: "blob" });
  const disposition = res.headers["content-disposition"] as string | undefined;
  const match = disposition?.match(/filename="?([^";\n]+)"?/);
  const filename = match?.[1] ?? `hasil-ujian-pmb-${id}.pdf`;
  const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const getHasilUjianDosen = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}): Promise<{ data: HasilUjianDosenItem[]; meta: UjianMeta }> => {
  const res = await api.get("/ujian/dosen/hasil", { params });
  return { data: res.data.data, meta: res.data.meta };
};
