"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "../../../components/AuthLayout";
import { forgotPassword } from "../../../services/AuthServices";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const message = await forgotPassword(email);
      setSuccess(message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Lupa Password?"
      subtitle="Masukkan email anda dan kami akan kirimkan link untuk reset password."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Email</label>
          <input
            type="email"
            placeholder="email@contoh.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 placeholder-gray-300 focus:outline-none"
            required
          />
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
          {loading ? "Loading..." : "Kirim Link Reset"}
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
    </AuthLayout>
  );
}
