"use client";

import { useRouter } from "next/navigation";
import { logout } from "../../../services/AuthServices";

export default function AdminUniversitasPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin Universitas</h1>
        <button
          onClick={handleLogout}
          className="text-white px-6 py-2 rounded-lg"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}