import api from "./api";
import { UjianMahasiswa, UjianMeta } from "../types";

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
