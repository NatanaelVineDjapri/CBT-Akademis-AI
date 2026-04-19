import api from "./api";
import { BankSoalItem, BankSoalMeta } from "../types";

export interface BankSoalResponse {
  data: BankSoalItem[];
  meta: BankSoalMeta;
}

export const getBankSoal = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<BankSoalResponse> => {
  const res = await api.get("/bank-soal", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const getBankSoalGlobal = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<BankSoalResponse> => {
  const res = await api.get("/bank-soal/global", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export interface BabWithCount {
  id: number;
  nama_bab: string;
  urutan: number;
  soal_count: number;
}

export interface BankSoalGlobalDetail {
  bank_soal: BankSoalItem;
  babs: BabWithCount[];
}

export const getBankSoalGlobalDetail = async (id: number): Promise<BankSoalGlobalDetail> => {
  const res = await api.get(`/bank-soal/global/${id}`);
  return res.data.data;
};

export interface SoalItem {
  id: number;
  deskripsi: string;
  tingkat_kesulitan: string;
  ai_generated: boolean;
  bab?: { id: number; nama_bab: string };
  jenis_soal: { id: number; jenis_soal: string; opsi_jawaban?: { id: number; opsi: string; teks: string; is_correct: boolean }[] }[];
  media_soal: { id: number; tipe: string; url: string }[];
}

export interface BankSoalSoalResponse {
  can_edit: boolean;
  bank_soal: BankSoalItem;
  data: SoalItem[];
}

export const getBankSoalSoal = async (id: number, params?: { search?: string }): Promise<BankSoalSoalResponse> => {
  const res = await api.get(`/bank-soal/${id}/soal`, { params });
  return res.data;
};

export const deleteBankSoal = async (id: number): Promise<void> => {
  await api.delete(`/bank-soal/${id}`);
};

export interface BabOption {
  id: number;
  nama_bab: string;
  urutan: number;
}

export const getBabByMataKuliah = async (mataKuliahId: number): Promise<BabOption[]> => {
  const res = await api.get("/bab", { params: { mata_kuliah_id: mataKuliahId } });
  return res.data.data ?? [];
};

export const createBankSoal = async (data: {
  nama: string;
  deskripsi?: string;
  mata_kuliah_id?: number | null;
  bab_id?: number | null;
  permission: string;
}): Promise<void> => {
  await api.post("/bank-soal", data);
};

export const updateBankSoal = async (
  id: number,
  data: { nama?: string; deskripsi?: string; mata_kuliah_id?: number | null; bab_id?: number | null; permission?: string }
): Promise<void> => {
  await api.put(`/bank-soal/${id}`, data);
};
