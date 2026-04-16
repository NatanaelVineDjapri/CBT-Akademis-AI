import api from "./api";
import { JadwalEvent } from "../types";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const sigRes = await api.post("/upload/signature");
  const { signature, timestamp, public_id, api_key, cloud_name } = sigRes.data;

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", api_key);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("public_id", public_id);
  body.append("overwrite", "true");
  body.append("invalidate", "true");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    { method: "POST", body }
  );
  if (!res.ok) throw new Error("Upload gagal");
  const data = await res.json();
  return data.secure_url as string;
};

export const updateProfile = async (data: {
  nama?: string;
  nim?: string;
  no_telp?: string;
  alamat?: string;
  foto_url?: string;
}): Promise<void> => {
  await api.put("/profile", data);
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

export const getJadwalDosen = async (): Promise<JadwalEvent[]> => {
  const res = await api.get("/jadwal/dosen");
  return res.data.data;
};
