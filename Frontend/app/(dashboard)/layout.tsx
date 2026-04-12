"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { UserProvider, useUser } from "../../context/UserContext";
import Sidebar from "../../components/Sidebar";
import Avatar from "../../components/Avatar";

const roleLabelMap: Record<string, string> = {
  admin_akademis_ai: "Admin Akademis AI",
  admin_universitas: "Admin Universitas",
  dosen: "Dosen",
  mahasiswa: "Mahasiswa",
  peserta_mahasiswa_baru: "Peserta PMB",
};

function getRoleLabel(user: { role: string; universitas_kode?: string }) {
  const base = roleLabelMap[user.role] ?? user.role;
  if (user.universitas_kode) return `${base} ${user.universitas_kode}`;
  return base;
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sidebar-width shrink-0 hidden lg:block" />
      <div className="flex-1 min-w-0 flex flex-col">
        {user.role !== "mahasiswa" && (
          <div
            className="w-full h-20 flex items-center justify-between lg:justify-end px-4 lg:px-8 sticky top-0 z-10"
            style={{
              backgroundImage: "url('/images/navbar.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} style={{ color: "var(--color-primary)" }} />
            </button>

            <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm">
              <div className="text-right">
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--color-primary)" }}>{user.nama}</p>
                <p className="text-xs text-gray-400">{getRoleLabel(user)}</p>
              </div>
              <Avatar user={user} size={36} />
            </div>
          </div>
        )}
        {user.role === "mahasiswa" && (
          <div className="lg:hidden h-16 flex items-center px-4 sticky top-0 z-10 bg-white border-b border-gray-100">
            <button
              className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} style={{ color: "var(--color-primary)" }} />
            </button>
          </div>
        )}
        <main
          className="flex-1 overflow-y-auto p-8"
          style={{
            backgroundImage: "url('/images/background-dashboard.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <DashboardInner>{children}</DashboardInner>
    </UserProvider>
  );
}
