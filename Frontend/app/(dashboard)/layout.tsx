"use client";

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

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="sidebar-width shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col">
        <div
          className="w-full h-20 flex items-center justify-end px-8 sticky top-0 z-10"
          style={{
            backgroundImage: "url('/images/navbar.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm">
            <div className="text-right">
              <p className="text-sm font-semibold leading-tight" style={{ color: "var(--color-primary)" }}>{user.nama}</p>
              <p className="text-xs text-gray-400">{getRoleLabel(user)}</p>
            </div>
            <Avatar user={user} size={36} />
          </div>
        </div>
        <main className="flex-1 p-8">{children}</main>
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
