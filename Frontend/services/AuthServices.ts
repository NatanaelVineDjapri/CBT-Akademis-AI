import api from "./api";

export interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  nim?: string;
  nidn?: string;
  no_telp?: string;
  alamat?: string;
  universitas_id?: number;
  prodi_id?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

const getCsrfCookie = async () => {
  await fetch("http://localhost:8000/sanctum/csrf-cookie", {
    credentials: "include",
  });
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  await getCsrfCookie();

  const res = await api.post("/auth/login", credentials);
  document.cookie = 'is_logged_in=true; path=/; max-age=86400'

  return res.data.user;
};

export const logout = async (): Promise<void> => {
  await getCsrfCookie();

  await api.post("/auth/logout");
  document.cookie = 'is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

};

export const me = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data.user;
};

export const forgotPassword = async (email: string): Promise<string> => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data.message;
};

export const resetPassword = async (data: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}): Promise<string> => {
  const res = await api.post("/auth/reset-password", data);
  return res.data.message;
};
