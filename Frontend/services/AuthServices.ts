import api from "./api";
import { User, LoginCredentials } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";

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
  const user = res.data.user;
  if (user.foto && !user.foto.startsWith("http")) {
    user.foto = `${baseUrl}${user.foto}`;
  }
  return user;
};

export const forgotPassword = async (email: string): Promise<string> => {
  await getCsrfCookie();
  const res = await api.post("/auth/forgot-password", { email });
  return res.data.message;
};

export const resetPassword = async (data: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}): Promise<string> => {
  await getCsrfCookie();
  const res = await api.post("/auth/reset-password", data);
  return res.data.message;
};
