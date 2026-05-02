import api from "./api";
import type { PmbStatistik, PmbPesertaItem, PmbPesertaMeta } from "@/types";

export const getPmbStatistik = async (): Promise<PmbStatistik[]> => {
  const res = await api.get("/pmb/penerimaan/statistik");
  return res.data;
};

export const getPmbPeserta = async (params?: {
  search?: string;
  tahun?: number;
  per_page?: number;
  page?: number;
}): Promise<{ data: PmbPesertaItem[]; meta: PmbPesertaMeta }> => {
  const res = await api.get("/pmb/penerimaan/peserta", { params });
  return res.data;
};

export const prosesPenerimaan = async (payload: {
  tahun: number;
  diterima: { user_id: number; nim?: string; prodi_id: number }[];
  ditolak: number[];
}): Promise<{ message: string; total_diterima: number; total_ditolak: number }> => {
  const res = await api.post("/pmb/penerimaan/proses", payload);
  return res.data;
};
