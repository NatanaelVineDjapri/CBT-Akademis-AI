import api from "./api";

export interface ProdiItem {
  id: number;
  fakultas_id: number;
  nama: string;
  kode: string;
  total_mahasiswa?: number;
  total_dosen?: number;
}

export interface ProdiPaginated {
  data: ProdiItem[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const getProdi = async (params?: {
  fakultas_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<ProdiPaginated> => {
  const res = await api.get("/prodi", { params });
  return res.data;
};

export const createProdi = async (data: {
  fakultas_id: number;
  nama: string;
  kode: string;
}): Promise<ProdiItem> => {
  const res = await api.post("/prodi", data);
  return res.data.data;
};

export const updateProdi = async (id: number, data: {
  nama?: string;
  kode?: string;
}): Promise<ProdiItem> => {
  const res = await api.put(`/prodi/${id}`, data);
  return res.data.data;
};

export const deleteProdi = async (id: number): Promise<void> => {
  await api.delete(`/prodi/${id}`);
};
