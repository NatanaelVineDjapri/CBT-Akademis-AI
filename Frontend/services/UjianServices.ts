import api from "./api";
import { UjianMahasiswa, UjianMeta, HasilUjianDosenItem, HasilUjianDosenDetail, DetailPesertaDosen } from "../types";

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
