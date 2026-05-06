import api from "./api";

export interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  target_role: string | null;
  expired_at: string | null;
  created_at: string;
}

export const getPengumuman = async (): Promise<Pengumuman[]> => {
  const res = await api.get("/pengumuman", { params: { per_page: 20 } });
  return res.data.data;
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
