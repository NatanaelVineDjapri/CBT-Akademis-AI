import api from "./api";
import type { DosenDashboard, MahasiswaDashboard, DosenPerformaMatkul, AdminUniversitasDashboard, AdminUniversitasPerforma } from "@/types";

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
