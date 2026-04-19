import api from "./api";
import { User, LoginCredentials } from "../types";

const getCsrfCookie = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

export type LoginResult =
  | { requires2fa: false; user: User }
  | { requires2fa: true; user: null };


export const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
  await getCsrfCookie();

  const res = await api.post("/auth/login", credentials);

  // Kalau butuh 2FA, jangan return user dulu
  if (res.data.requires_2fa) {
    return { requires2fa: true, user: null };
  }

  return { requires2fa: false, user: res.data.user };
};

export const verify2FA = async (code: string): Promise<User> => {
  const res = await api.post("/auth/login/2fa-verify", { code });
  return res.data.user;
};

export const setup2FA = async (): Promise<{ secret: string; qr_code: string }> => {
  const res = await api.get("/auth/2fa/setup");
  return res.data;
};

export const enable2FA = async (code: string): Promise<string> => {
  const res = await api.post("/auth/2fa/enable", { code });
  return res.data.message;
};

export const disable2FA = async (code: string): Promise<string> => {
  const res = await api.post("/auth/2fa/disable", { code });
  return res.data.message;
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
