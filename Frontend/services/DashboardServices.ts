import api from "./api";
import type { DosenDashboard, MahasiswaDashboard, DosenPerformaMatkul, AdminUniversitasDashboard, AdminUniversitasPerforma, AdminAkademisDashboard } from "@/types";

export const getMahasiswaDashboard = async (): Promise<MahasiswaDashboard> => {
  const res = await api.get("/dashboard/mahasiswa");
  return res.data;
};


export const getDosenDashboard = async (): Promise<DosenDashboard> => {
  const res = await api.get("/dashboard/dosen");
  return res.data;
};

export const getDosenPerforma = async (): Promise<DosenPerformaMatkul[]> => {
  const res = await api.get("/dashboard/dosen/performa");
  return res.data.data;
};

export const getAdminUniversitasDashboard = async (): Promise<AdminUniversitasDashboard> => {
  const res = await api.get("/dashboard/admin-universitas");
  return res.data;
};

export const getAdminUniversitasPerforma = async (): Promise<AdminUniversitasPerforma> => {
  const res = await api.get("/dashboard/admin-universitas/performa");
  return res.data;
};

export const getAdminUniversitasDistribusi = async (): Promise<{ nama: string; kode: string; total: number }[]> => {
  const res = await api.get("/dashboard/admin-universitas/distribusi");
  return res.data;
};

export const getAdminUniversitasPerformaProdi = async (): Promise<{ keys: string[]; data: ({ nama: string } & Record<string, number>)[] }> => {
  const res = await api.get("/dashboard/admin-universitas/performa-prodi");
  return res.data;
};

export const getAdminUniversitasAktivitasUjian = async (): Promise<{ keys: string[]; data: ({ nama: string } & Record<string, number>)[] }> => {
  const res = await api.get("/dashboard/admin-universitas/aktivitas-ujian");
  return res.data;
};

export const getAdminUniversitasKelulusan = async (): Promise<{ nama: string; persentase: number; total: number; lulus: number }[]> => {
  const res = await api.get("/dashboard/admin-universitas/kelulusan");
  return res.data;
};

export const getAdminUniversitasTrenNilai = async (): Promise<{ bulan: string; rata_rata: number }[]> => {
  const res = await api.get("/dashboard/admin-universitas/tren-nilai");
  return res.data;
};

export const getAdminAkademisDashboard = async (): Promise<AdminAkademisDashboard> => {
  const res = await api.get("/dashboard/admin-akademis");
  return res.data;
};

export const getAdminAkademisDistribusiPengguna = async (): Promise<{ nama: string; dosen: number; mahasiswa: number }[]> => {
  const res = await api.get("/dashboard/admin-akademis/distribusi-pengguna");
  return res.data;
};

export const getAdminAkademisAktivitasUjian = async (): Promise<{ nama: string; total: number }[]> => {
  const res = await api.get("/dashboard/admin-akademis/aktivitas-ujian");
  return res.data;
};

export const getAdminAkademisKelulusan = async (): Promise<{ nama: string; persentase: number; total: number; lulus: number }[]> => {
  const res = await api.get("/dashboard/admin-akademis/kelulusan");
  return res.data;
};

export const getAdminAkademisTrenNilai = async (): Promise<{ bulan: string; rata_rata: number }[]> => {
  const res = await api.get("/dashboard/admin-akademis/tren-nilai");
  return res.data;
};
