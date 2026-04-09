import api from "./api";
import { User, LoginCredentials } from "../types";

const getCsrfCookie = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  await getCsrfCookie();

  const res = await api.post("/auth/login", credentials);
  return res.data.user;
};

export const logout = async (): Promise<void> => {
  await getCsrfCookie();
  await api.post("/auth/logout");
  // document.cookie = 'laravel_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  // document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

};

export const me = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  const user = res.data.user;
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
