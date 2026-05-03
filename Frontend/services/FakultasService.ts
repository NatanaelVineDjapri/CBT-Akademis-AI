import api from "./api";

export interface FakultasItem {
  id: number;
  universitas_id: number;
  nama: string;
  kode: string;
  prodi_count?: number;
  total_mahasiswa?: number;
  total_dosen?: number;
}

export interface FakultasPaginated {
  data: FakultasItem[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const getFakultas = async (params?: {
  universitas_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<FakultasPaginated> => {
  const res = await api.get("/fakultas", { params });
  return res.data;
};

export const createFakultas = async (data: {
  universitas_id: number;
  nama: string;
  kode: string;
}): Promise<FakultasItem> => {
  const res = await api.post("/fakultas", data);
  return res.data.data;
};

export const updateFakultas = async (id: number, data: {
  nama?: string;
  kode?: string;
}): Promise<FakultasItem> => {
  const res = await api.put(`/fakultas/${id}`, data);
  return res.data.data;
};

export const deleteFakultas = async (id: number): Promise<void> => {
  await api.delete(`/fakultas/${id}`);
};
