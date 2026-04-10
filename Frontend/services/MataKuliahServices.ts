import api from "./api";
import { MataKuliah, MataKuliahMeta } from "../types";

export const getMataKuliah = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  prodi_id?: number;
}): Promise<{ data: MataKuliah[]; meta: MataKuliahMeta }> => {
  const res = await api.get("/mata-kuliah", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const getMyMataKuliah = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: "asc" | "desc";
}): Promise<{ data: MataKuliah[]; meta: MataKuliahMeta }> => {
  const res = await api.get("/mata-kuliah/my", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const createMataKuliah = async (payload: {
  nama: string;
  kode: string;
  prodi_id: number;
}): Promise<MataKuliah> => {
  const res = await api.post("/mata-kuliah", payload);
  return res.data.data;
};

export const updateMataKuliah = async (
  id: number,
  payload: Partial<{ nama: string; kode: string; prodi_id: number }>
): Promise<MataKuliah> => {
  const res = await api.put(`/mata-kuliah/${id}`, payload);
  return res.data.data;
};

export const deleteMataKuliah = async (id: number): Promise<void> => {
  await api.delete(`/mata-kuliah/${id}`);
};
