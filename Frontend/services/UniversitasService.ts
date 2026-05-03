import api from "./api";

export interface UniversitasItem {
  id: number;
  nama: string;
  kode: string;
  alamat?: string | null;
  logo?: string | null;
  fakultas_count?: number;
  total_mahasiswa?: number;
  total_dosen?: number;
}

export interface UniversitasPaginated {
  data: UniversitasItem[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const getUniversitas = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<UniversitasPaginated> => {
  const res = await api.get("/universitas", { params });
  return res.data;
};

export const createUniversitas = async (data: FormData): Promise<UniversitasItem> => {
  const res = await api.post("/universitas", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateUniversitas = async (id: number, data: FormData): Promise<UniversitasItem> => {
  data.append("_method", "PUT");
  const res = await api.post(`/universitas/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteUniversitas = async (id: number): Promise<void> => {
  await api.delete(`/universitas/${id}`);
};
