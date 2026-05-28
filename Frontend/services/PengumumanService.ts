import api from "./api";

export interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  target_role: string | null;
  expired_at: string | null;
  created_at: string;
}

export interface PengumumanMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface PengumumanParams {
  search?: string;
  target_role?: string;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  per_page?: number;
}

export const getPengumuman = async (params: PengumumanParams = {}): Promise<{ data: Pengumuman[]; meta: PengumumanMeta }> => {
  const res = await api.get("/pengumuman", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const createPengumuman = async (data: { judul: string; isi: string; target_role?: string; expired_at?: string }): Promise<Pengumuman> => {
  const res = await api.post("/pengumuman", data);
  return res.data.data;
};

export const updatePengumuman = async (id: number, data: { judul?: string; isi?: string; target_role?: string; expired_at?: string }): Promise<Pengumuman> => {
  const res = await api.put(`/pengumuman/${id}`, data);
  return res.data.data;
};

export const deletePengumuman = async (id: number): Promise<void> => {
  await api.delete(`/pengumuman/${id}`);
};
