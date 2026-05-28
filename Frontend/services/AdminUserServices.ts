import api from "./api";

export interface FakultasItem {
  id: number;
  nama: string;
  kode: string;
  universitas_id: number;
  prodi_count: number;
  total_mahasiswa: number;
  total_dosen: number;
}

export interface ProdiItem {
  id: number;
  nama: string;
  kode: string;
  fakultas_id: number;
  total_mahasiswa: number;
  total_dosen: number;
  fakultas?: { id: number; nama: string; kode: string };
}

export interface AdminUserItem {
  id: number;
  nama: string;
  email: string;
  role: string;
  nim?: string | null;
  nidn?: string | null;
  no_telp?: string | null;
  alamat?: string | null;
  tahun_masuk?: number | null;
  foto?: string | null;
  prodi_id?: number | null;
  universitas_id?: number;
  prodi?: { id: number; nama: string; kode: string } | null;
  universitas?: { id: number; nama: string; kode: string } | null;
  created_at?: string;
}

type Meta = { total: number; per_page: number; current_page: number; last_page: number };

export const getFakultas = async (params?: {
  universitas_id?: number;
  search?: string;
  per_page?: number;
  page?: number;
}): Promise<{ data: FakultasItem[]; meta: Meta }> => {
  const res = await api.get("/fakultas", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const getProdi = async (params?: {
  fakultas_id?: number;
  universitas_id?: number;
  search?: string;
  per_page?: number;
  page?: number;
}): Promise<{ data: ProdiItem[]; meta: Meta }> => {
  const res = await api.get("/prodi", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const getAdminUsers = async (params?: {
  prodi_id?: number;
  universitas_id?: number;
  role?: string;
  search?: string;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_dir?: string;
}): Promise<{ data: AdminUserItem[]; meta: Meta }> => {
  const res = await api.get("/users", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const createAdminUser = async (data: {
  nama: string;
  email: string;
  password: string;
  role: string;
  nim?: string;
  nidn?: string;
  no_telp?: string;
  tahun_masuk?: number | string;
  prodi_id?: number;
  universitas_id?: number;
}): Promise<AdminUserItem> => {
  const res = await api.post("/users", data);
  return res.data.data;
};

export const updateAdminUser = async (id: number, data: {
  nama?: string;
  email?: string;
  role?: string;
  nim?: string;
  nidn?: string;
  no_telp?: string;
  alamat?: string;
  tahun_masuk?: number | string;
  prodi_id?: number;
}): Promise<AdminUserItem> => {
  const res = await api.put(`/users/${id}`, data);
  return res.data.data;
};

export const deleteAdminUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const exportAdminUsers = async (params: {
  role?: string;
  tahun_dari?: string;
  tahun_sampai?: string;
  prodi_id?: number;
  universitas_id?: number;
  columns?: string[];
}): Promise<Blob> => {
  const res = await api.get("/users/export-excel", {
    params: { ...params, columns: params.columns?.join(",") },
    responseType: "blob",
  });
  return res.data;
};

export const importAdminUsers = async (data: FormData): Promise<{ gagal: { baris: number; kolom: string; error: string }[] }> => {
  const res = await api.post("/users/import", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ─── Admin Akademis AI (global, all universities) ─────────────────────────────

export const getAdminAkademisUsers = async (params?: {
  universitas_id?: number;
  role?: string;
  search?: string;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_dir?: string;
}): Promise<{ data: AdminUserItem[]; meta: Meta }> => {
  const res = await api.get("/admin-users", { params });
  return { data: res.data.data, meta: res.data.meta };
};

export const createAdminAkademisUser = async (data: {
  universitas_id: number;
  nama: string;
  email: string;
  password: string;
  role: string;
  nim?: string;
  nidn?: string;
  no_telp?: string;
  alamat?: string;
  tahun_masuk?: number | string;
  prodi_id?: number;
}): Promise<AdminUserItem> => {
  const res = await api.post("/admin-users", data);
  return res.data.data;
};

export const updateAdminAkademisUser = async (id: number, data: {
  nama?: string;
  email?: string;
  role?: string;
  nim?: string;
  nidn?: string;
  no_telp?: string;
  alamat?: string;
  tahun_masuk?: number | string;
  prodi_id?: number;
}): Promise<AdminUserItem> => {
  const res = await api.put(`/admin-users/${id}`, data);
  return res.data.data;
};

export const deleteAdminAkademisUser = async (id: number): Promise<void> => {
  await api.delete(`/admin-users/${id}`);
};

export const importAdminAkademisUsers = async (data: FormData): Promise<{ gagal: { baris: number; kolom: string; error: string }[] }> => {
  const res = await api.post("/admin-users/import", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
