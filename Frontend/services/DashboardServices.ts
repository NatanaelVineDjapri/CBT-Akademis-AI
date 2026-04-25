import api from "./api";
import type { DosenDashboard, MahasiswaDashboard, DosenPerformaMatkul } from "@/types";

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
