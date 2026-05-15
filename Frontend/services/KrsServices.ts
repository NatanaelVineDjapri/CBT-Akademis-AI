import api from "./api";
import type { KrsMahasiswaItem, KrsMahasiswaDetail, MataKuliah } from "@/types";

export const getKrsMahasiswa = async (params?: {
  page?: number;
  per_page?: number;
  prodi_id?: number;
  search?: string;
}): Promise<{ data: KrsMahasiswaItem[]; meta: { total: number; per_page: number; current_page: number; last_page: number } }> => {
  const res = await api.get("/krs/mahasiswa", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const getKrsMahasiswaDetail = async (userId: number): Promise<KrsMahasiswaDetail> => {
  const res = await api.get(`/krs/mahasiswa/${userId}`);
  return res.data.data;
};

export const addKrsMatkul = async (userId: number, matkulIds: number[], tahunAjaran: string): Promise<void> => {
  await api.post(`/krs/mahasiswa/${userId}/add`, { mata_kuliah_ids: matkulIds, tahun_ajaran: tahunAjaran });
};

export const removeKrsMatkul = async (userId: number, matkulId: number): Promise<void> => {
  await api.delete(`/krs/mahasiswa/${userId}/matkul/${matkulId}`);
};

export const applyKrsPackage = async (prodiId: number, semester: number, tahunAjaran: string): Promise<{ message: string; students: number; matkuls: number; inserted: number }> => {
  const res = await api.post("/krs/apply-package", { prodi_id: prodiId, semester, tahun_ajaran: tahunAjaran });
  return res.data;
};

export const getSemesterCourses = async (prodiId: number, semester: number): Promise<MataKuliah[]> => {
  const res = await api.get(`/krs/prodi/${prodiId}/semester/${semester}`);
  return res.data.data;
};
