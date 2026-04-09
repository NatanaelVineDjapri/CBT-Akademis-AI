import api from "./api";
import { User, JadwalEvent } from "../types";

export const updateProfile = async (formData: FormData): Promise<void> => {
  await api.post("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePassword = async (data: {
  password_lama: string;
  password: string;
  password_confirmation: string;
}): Promise<void> => {
  await api.put("/profile/password", data);
};

export const getJadwal = async (): Promise<JadwalEvent[]> => {
  const res = await api.get("/jadwal");
  return res.data.data;
};
