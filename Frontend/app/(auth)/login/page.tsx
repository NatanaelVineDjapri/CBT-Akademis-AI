"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "../../../components/AuthLayout";
import { login } from "../../../services/AuthServices";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login({ email, password });

      if (user.role === "admin_akademis_ai") router.push("/admin-akademis");
      else if (user.role === "admin_universitas")
        router.push("/admin-universitas");
      else if (user.role === "dosen") router.push("/dosen");
      else if (user.role === "mahasiswa") router.push("/mahasiswa");
      else if (user.role === "peserta_mahasiswa_baru") router.push("/pmb");
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

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
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500  placeholder-gray-300 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Password</label>
          <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white ">
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
