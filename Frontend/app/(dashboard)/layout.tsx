"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { UserProvider, useUser } from "../../context/UserContext";
import Sidebar from "../../components/Sidebar";
import Avatar from "../../components/Avatar";
import { getActiveSession } from "../../services/UjianServices";

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
  const pathname = usePathname();
  const isExamPage = /^\/mahasiswa\/ujian\/\d+/.test(pathname ?? "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeSession, setActiveSession] = useState<{ peserta_ujian_id: number; nama_ujian: string } | null>(null);

  useEffect(() => {
    if (localStorage.getItem("sidebar-collapsed") === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (user?.role !== "mahasiswa" || isExamPage) return;
    getActiveSession().then(session => {
      if (session) setActiveSession(session);
    }).catch(() => {});
  }, [user, isExamPage]);

  const toggleCollapsed = () => {
    setIsTransitioning(true);
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 310);
  };

  if (!user) return null;

  if (isExamPage) return (
    <main
      className="h-screen overflow-y-auto p-8"
      style={{
        backgroundImage: "url('/images/background-dashboard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {children}
    </main>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} onToggle={toggleCollapsed} />
      <div className={`${collapsed ? "w-16" : "w-[280px]"} shrink-0 hidden lg:block`} />
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
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} style={{ color: "var(--color-primary)" }} />
            </button>
            <div className="flex items-center gap-3 bg-white rounded-full sm:rounded-lg p-1 sm:px-4 sm:py-3 shadow-sm">
              <div className="text-right hidden sm:block">
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
        {activeSession && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Ujian Sedang Berlangsung</h3>
                <p className="text-sm text-gray-500">Kamu masih memiliki sesi ujian aktif yang belum diselesaikan.</p>
                <p className="text-sm font-semibold mt-2" style={{ color: "var(--color-primary)" }}>{activeSession.nama_ujian}</p>
              </div>
              <Link
                href={`/mahasiswa/ujian/${activeSession.peserta_ujian_id}`}
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold text-center"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Lanjutkan Ujian
              </Link>
            </div>
          </div>
        )}
        <main
          className={`flex-1 overflow-y-auto px-7 pt-5 pb-10 sm:px-8 sm:pt-8 sm:pb-8${isTransitioning ? " pointer-events-none" : ""}`}
          style={{
            backgroundImage: "url('/images/background-dashboard.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {children}
        </main>
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
