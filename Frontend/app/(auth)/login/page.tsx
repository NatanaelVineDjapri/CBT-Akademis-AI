"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "../../../components/AuthLayout";
import { login, verify2FA } from "../../../services/AuthServices";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [requires2fa, setRequires2fa] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");

  const redirectByRole = (role: string) => {
    if (role === "admin_akademis_ai") router.push("/admin-akademis");
    else if (role === "admin_universitas") router.push("/admin-universitas");
    else if (role === "dosen") router.push("/dosen");
    else if (role === "mahasiswa") router.push("/mahasiswa");
    else if (role === "peserta_mahasiswa_baru") router.push("/pmb");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });

      if (result.requires2fa) {
        setRequires2fa(true);
      } else {
        redirectByRole(result.user.role);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await verify2FA(twoFaCode);
      redirectByRole(user.role);
    } catch (err: any) {
      setError(err.response?.data?.message || "Kode 2FA salah!");
    } finally {
      setLoading(false);
    }
  };

  if (requires2fa) {
    return (
      <AuthLayout
        title="Verifikasi 2FA"
        subtitle="Masukkan kode 6 digit dari aplikasi Google Authenticator kamu."
      >
        <form onSubmit={handleVerify2FA} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Kode Autentikasi
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 placeholder-gray-300 focus:outline-none tracking-widest text-center"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || twoFaCode.length !== 6}
            className="w-full text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>

          {/* Back to login */}
          <button
            type="button"
            onClick={() => {
              setRequires2fa(false);
              setTwoFaCode("");
              setError("");
            }}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Kembali ke login
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Selamat Datang!"
      subtitle="Mohon input email dan password anda untuk lanjut ke laman CBT."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Email</label>
          <input
            type="email"
            placeholder="admin2026@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 placeholder-gray-300 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Password</label>
          <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 text-sm text-gray-500 placeholder-gray-300 outline-none bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
          <div className="text-right mt-1">
            <Link
              href="/forgot-password"
              className="text-sm text-teal-600 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Lupa password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 mt-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? "Loading..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}