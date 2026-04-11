import api from "./api";
import { Nilai, NilaiMeta } from "../types";

export const getNilai = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  sort_by_2?: string;
  sort_dir_2?: "asc" | "desc";
}): Promise<{ data: Nilai[]; meta: NilaiMeta }> => {
  const res = await api.get("/nilai", { params });
  return { data: res.data.data, meta: res.data.meta };
};
