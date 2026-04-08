"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Eye,
  BarChart2,
  Calendar,
  Settings,
  Users,
  ScrollText,
  Trophy,
  GraduationCap,
  UserCircle,
  List,
  Building2,
  LogOut,
} from "lucide-react";
import { User, logout } from "../services/AuthServices";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuByRole: Record<string, MenuItem[]> = {
  admin_akademis_ai: [
    {
      label: "Beranda",
      href: "/admin-akademis",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Daftar",
      href: "/admin-akademis/daftar",
      icon: <List size={18} />,
    },
    {
      label: "Tambah Institusi",
      href: "/admin-akademis/tambah-institusi",
      icon: <Building2 size={18} />,
    },
    {
      label: "Settings",
      href: "/admin-akademis/settings",
      icon: <Settings size={18} />,
    },
  ],
  admin_universitas: [
    {
      label: "Beranda",
      href: "/admin-universitas",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Bank Soal PMB",
      href: "/admin-universitas/bank-soal-pmb",
      icon: <BookOpen size={18} />,
    },
    {
      label: "Ujian PMB",
      href: "/admin-universitas/ujian-pmb",
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Monitoring",
      href: "/admin-universitas/monitoring",
      icon: <Eye size={18} />,
    },
    {
      label: "Hasil Ujian PMB",
      href: "/admin-universitas/hasil-ujian-pmb",
      icon: <BarChart2 size={18} />,
    },
    {
      label: "User",
      href: "/admin-universitas/user",
      icon: <Users size={18} />,
    },
    {
      label: "Log",
      href: "/admin-universitas/log",
      icon: <ScrollText size={18} />,
    },
    {
      label: "Settings",
      href: "/admin-universitas/settings",
      icon: <Settings size={18} />,
    },
  ],
  dosen: [
    { label: "Beranda", href: "/dosen", icon: <LayoutDashboard size={18} /> },
    {
      label: "Bank Soal",
      href: "/dosen/bank-soal",
      icon: <BookOpen size={18} />,
    },
    { label: "Ujian", href: "/dosen/ujian", icon: <ClipboardList size={18} /> },
    { label: "Monitoring", href: "/dosen/monitoring", icon: <Eye size={18} /> },
    {
      label: "Hasil Ujian",
      href: "/dosen/hasil-ujian",
      icon: <BarChart2 size={18} />,
    },
    { label: "Jadwal", href: "/dosen/jadwal", icon: <Calendar size={18} /> },
    {
      label: "Settings",
      href: "/dosen/settings",
      icon: <Settings size={18} />,
    },
  ],
  mahasiswa: [
    {
      label: "Beranda",
      href: "/mahasiswa",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Ujian",
      href: "/mahasiswa/ujian",
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Jadwal",
      href: "/mahasiswa/jadwal",
      icon: <Calendar size={18} />,
    },
    { label: "Nilai", href: "/mahasiswa/nilai", icon: <Trophy size={18} /> },
    {
      label: "Mata Kuliah",
      href: "/mahasiswa/mata-kuliah",
      icon: <GraduationCap size={18} />,
    },
    {
      label: "Profil",
      href: "/mahasiswa/profile",
      icon: <UserCircle size={18} />,
    },
  ],
  peserta_mahasiswa_baru: [
    { label: "Beranda", href: "/pmb", icon: <LayoutDashboard size={18} /> },
    { label: "Ujian", href: "/pmb/ujian", icon: <ClipboardList size={18} /> },
  ],
};

const roleLabelMap: Record<string, string> = {
  admin_akademis_ai: "Admin Akademis AI",
  admin_universitas: "Admin Universitas",
  dosen: "Dosen",
  mahasiswa: "Mahasiswa",
  peserta_mahasiswa_baru: "Peserta PMB",
};

function getRoleLabel(user: User) {
  const base = roleLabelMap[user.role] ?? user.role;

  if (user.universitas_kode) {
    return `${base} ${user.universitas_kode}`;
  }

  return base;
}

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = menuByRole[user.role] ?? [];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="sidebar-width shrink-0 fixed left-0 top-0 h-screen bg-white flex flex-col border-r border-gray-100 shadow-sm py-3 px-4 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-center">
        <Image
          src="/images/akademis-logo-horizontal.webp"
          alt="akademis.ai"
          width={190}
          height={36}
          priority
          className="h-auto w-auto max-w-full"
        />
      </div>
      <div className="border-t border-gray-400 mx-4" />

      {/* User Profile */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 py-3 rounded-xl">
          <div
            className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Users size={20} className="text-white" />
          </div>

          <div className="min-w-0">
            <p
              className="text-sm font-bold truncate"
              style={{ color: "var(--color-primary)" }}
            >
              {user.nama}
            </p>

            <p
              className="text-xs truncate font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              {getRoleLabel(user)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 px-4">
        <div className="border-t border-gray-400" />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "text-white font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              style={
                isActive ? { backgroundColor: "var(--color-primary)" } : {}
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-2 border-t border-gray-100 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-500 rounded-lg transition-colors hover:text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
