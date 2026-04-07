"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthLayout from "../../../components/AuthLayout";
import { resetPassword } from "../../../services/AuthServices";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const message = await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Password Baru
        </label>
        <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus-within:ring-2 focus-within:ring-teal-500">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 karakter"
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
      </div>

      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Konfirmasi Password
        </label>
        <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus-within:ring-2 focus-within:ring-teal-500">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Ulangi password baru"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="flex-1 text-sm text-gray-500 placeholder-gray-300 outline-none bg-white"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="ml-2 text-gray-400"
          >
            {showConfirm ? (
              <EyeOff className="w-[18px] h-[18px]" />
            ) : (
              <Eye className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg text-center">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {loading ? "Loading..." : "Reset Password"}
      </button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          Kembali ke Login
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Masukkan password baru untuk akun anda."
    >
      <Suspense fallback={<p className="text-sm text-gray-400">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
