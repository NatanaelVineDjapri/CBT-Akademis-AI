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
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  ListChecks,
} from "lucide-react";
import { preload } from "swr";
import { User } from "@/types";
import { logout } from "../services/AuthServices";
import { getMyMataKuliah, getMataKuliah } from "../services/MataKuliahServices";
import { getJadwal, getJadwalDosen } from "../services/UserServices";
import { getNilai } from "../services/NilaiServices";
import { getMyUjian, getHasilUjianDosen, getHasilUjianAdminUniversitas } from "../services/UjianServices";
import { getMahasiswaDashboard, getDosenDashboard, getAdminUniversitasDashboard, getAdminUniversitasPerforma, getAdminUniversitasDistribusi, getAdminUniversitasPerformaProdi, getAdminUniversitasAktivitasUjian, getAdminUniversitasKelulusan, getAdminUniversitasTrenNilai, getAdminAkademisDashboard, getAdminAkademisDistribusiPengguna, getAdminAkademisAktivitasUjian, getAdminAkademisKelulusan, getAdminAkademisTrenNilai, getAdminAkademisPertumbuhanPengguna } from "../services/DashboardServices";
import { getBankSoal } from "../services/BankSoalServices";
import { getFakultas } from "../services/AdminUserServices";
import { getUniversitas } from "../services/UniversitasService";
import { getPmbPeserta, getPmbStatistik } from "../services/PmbPenerimaanServices";
import { getKrsMahasiswa } from "../services/KrsServices";
import { getAudits } from "../services/AuditService";
import { calcPerPage } from "../hooks/usePerPage";

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
      label: "Institusi",
      href: "/admin-akademis/institusi",
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
      label: "Penerimaan PMB",
      href: "/admin-universitas/penerimaan-pmb",
      icon: <GraduationCap size={18} />,
    },
    {
      label: "Mata Kuliah",
      href: "/admin-universitas/mata-kuliah",
      icon: <BookOpen size={18} />,
    },
    {
      label: "KRS",
      href: "/admin-universitas/krs",
      icon: <ListChecks size={18} />,
    },
    {
      label: "User",
      href: "/admin-universitas/user",
      icon: <Users size={18} />,
    },
    {
      label: "Pengumuman",
      href: "/admin-universitas/pengumuman",
      icon: <Megaphone size={18} />,
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
      label: "Profil",
      href: "/dosen/profile",
      icon: <UserCircle size={18} />,
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

export default function Sidebar({ user, isOpen, onClose, collapsed, onToggle }: {
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = menuByRole[user.role] ?? [];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      sessionStorage.removeItem("stat-animated");
      sessionStorage.removeItem("dashboard-visited");
      router.push("/login");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <div className={`${collapsed ? "w-16" : "w-[280px]"} shrink-0 fixed left-0 top-0 h-screen z-40 transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        {/* Toggle button — outside scroll container so it doesn't get clipped */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-50 cursor-pointer"
        >
          {collapsed
            ? <ChevronRight size={12} className="text-gray-500" />
            : <ChevronLeft size={12} className="text-gray-500" />
          }
        </button>

        {/* Scrollable inner container */}
        <div className="h-full flex flex-col bg-white border-r border-gray-100 shadow-sm py-3 overflow-y-auto">

        {/* Logo */}
        <div className={`${collapsed ? "px-2 py-5" : "px-6 py-6"} flex items-center justify-center`}>
          {collapsed ? (
            <Image src="/images/akademis-logo-1x1.png" alt="akademis.ai" width={36} height={36} priority className="h-auto w-auto" />
          ) : (
            <Image src="/images/akademis-logo-horizontal.webp" alt="akademis.ai" width={190} height={36} priority className="h-auto w-auto max-w-full" />
          )}
        </div>
        <div className={`border-t border-gray-400 ${collapsed ? "mx-2" : "mx-4"}`} />

        {/* User Profile */}
        <div className={`${collapsed ? "px-2 py-3 flex justify-center" : "px-4 py-3"}`}>
          {collapsed ? (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
              <Users size={20} className="text-white" />
            </div>
          ) : (
            <div className="flex items-center gap-3 py-3 rounded-xl">
              <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
                <Users size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "var(--color-primary)" }}>{user.nama}</p>
                <p className="text-xs truncate font-medium" style={{ color: "var(--color-primary)" }}>{getRoleLabel(user)}</p>
              </div>
            </div>
          )}
        </div>

        <div className={`mb-3 ${collapsed ? "px-2" : "px-4"}`}>
          <div className="border-t border-gray-400" />
        </div>

        {/* Menu */}
        <nav className={`flex-1 ${collapsed ? "px-1" : "px-3"} space-y-1 overflow-y-auto`}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                onMouseEnter={() => {
                  // — admin akademis —
                  if (item.href === "/admin-akademis/institusi") {
                    preload(["/universitas", "", 1, 0], () => getUniversitas({ page: 1, per_page: 10 }));
                  } else if (item.href === "/admin-akademis") {
                    preload("/dashboard/admin-akademis", getAdminAkademisDashboard);
                    preload("/dashboard/admin-akademis/distribusi-pengguna", getAdminAkademisDistribusiPengguna);
                    preload("/dashboard/admin-akademis/aktivitas-ujian", getAdminAkademisAktivitasUjian);
                    preload("/dashboard/admin-akademis/kelulusan", getAdminAkademisKelulusan);
                    preload("/dashboard/admin-akademis/tren-nilai", getAdminAkademisTrenNilai);
                    preload("/dashboard/admin-akademis/pertumbuhan-pengguna", getAdminAkademisPertumbuhanPengguna);
                  // — mahasiswa —
                  } else if (item.href === "/mahasiswa") {
                    preload("/dashboard/mahasiswa", getMahasiswaDashboard);
                  } else if (item.href === "/mahasiswa/ujian") {
                    const pp = calcPerPage(245, 4, 255);
                    preload(["/ujian/my", "sedang_berlangsung", "", "", 1, pp], ([, st, s, sd, p, perPg]: [string, string, string, string, number, number]) =>
                      getMyUjian({ status: st, search: s, sort_dir: (sd || undefined) as "asc" | "desc" | undefined, page: p, per_page: perPg }));
                  } else if (item.href === "/mahasiswa/jadwal") {
                    preload("/jadwal", getJadwal);
                  } else if (item.href === "/mahasiswa/nilai") {
                    const pp = calcPerPage(53, 1, 300);
                    preload(["/nilai", "", 1, pp, "tanggal", "desc"], ([, s, p, perPg]: [string, string, number, number, string, string]) =>
                      getNilai({ search: s, page: p, per_page: perPg, sort_by: "tanggal", sort_dir: "desc" as "asc" | "desc" }));
                  } else if (item.href === "/mahasiswa/mata-kuliah") {
                    const pp = calcPerPage(128, 4, 200);
                    preload(["/mata-kuliah/my", "", 1, pp, ""], ([, s, p, perPg, so]: [string, string, number, number, string]) =>
                      getMyMataKuliah({ search: s, page: p, per_page: perPg, sort: (so || undefined) as "asc" | "desc" | undefined }));
                  // — dosen —
                  } else if (item.href === "/dosen") {
                    preload("/dashboard/dosen", getDosenDashboard);
                  } else if (item.href === "/dosen/bank-soal") {
                    preload(["/bank-soal", "", 1], ([, s, p]: [string, string, number]) =>
                      getBankSoal({ search: s, page: p, per_page: 10 }));
                  } else if (item.href === "/dosen/hasil-ujian") {
                    const pp = calcPerPage(53, 1, 480);
                    preload(["/ujian/dosen/hasil", "", 1, pp, "tanggal", "desc"], ([, s, p, perPg, sb, sd]: [string, string, number, number, string, string]) =>
                      getHasilUjianDosen({ search: s, page: p, per_page: perPg, sort_by: sb, sort_dir: sd as "asc" | "desc" }));
                  } else if (item.href === "/dosen/jadwal") {
                    preload("/jadwal/dosen", getJadwalDosen);
                  // — admin universitas —
                  } else if (item.href === "/admin-universitas") {
                    preload("/dashboard/admin-universitas", getAdminUniversitasDashboard);
                    preload("/dashboard/admin-universitas/performa", getAdminUniversitasPerforma);
                    preload("/dashboard/admin-universitas/distribusi", getAdminUniversitasDistribusi);
                    preload("/dashboard/admin-universitas/performa-prodi", getAdminUniversitasPerformaProdi);
                    preload("/dashboard/admin-universitas/aktivitas-ujian", getAdminUniversitasAktivitasUjian);
                    preload("/dashboard/admin-universitas/kelulusan", getAdminUniversitasKelulusan);
                    preload("/dashboard/admin-universitas/tren-nilai", getAdminUniversitasTrenNilai);
                    preload("/pmb/penerimaan/statistik", getPmbStatistik);
                  } else if (item.href === "/admin-universitas/bank-soal-pmb") {
                    preload(["/bank-soal", "", 1], ([, s, p]: [string, string, number]) =>
                      getBankSoal({ search: s, page: p, per_page: 10 }));
                  } else if (item.href === "/admin-universitas/penerimaan-pmb") {
                    preload(["/pmb/penerimaan/peserta", "", new Date().getFullYear()], ([, s, t]: [string, string, number]) =>
                      getPmbPeserta({ search: s, tahun: t, per_page: 200 }));
                    preload("/pmb/penerimaan/statistik", getPmbStatistik);
                  } else if (item.href === "/admin-universitas/hasil-ujian-pmb") {
                    const pp = calcPerPage(53, 1, 395);
                    preload(["/ujian/admin-universitas/hasil", "", 1, pp, "tanggal", "desc"], ([, s, p, perPg, sb, sd]: [string, string, number, number, string, string]) =>
                      getHasilUjianAdminUniversitas({ search: s, page: p, per_page: perPg, sort_by: sb, sort_dir: sd as "asc" | "desc" }));
                  } else if (item.href === "/admin-universitas/mata-kuliah") {
                    const pp = calcPerPage(53, 1, 390);
                    preload(["/mata-kuliah", "", undefined, 1, pp], ([, s, p, pg]: [string, string, number | undefined, number, number]) =>
                      getMataKuliah({ search: s, prodi_id: p, page: pg, per_page: pp }));
                  } else if (item.href === "/admin-universitas/krs") {
                    const pp = calcPerPage(65, 1, 360);
                    preload(["/krs/mahasiswa", "", undefined, 1, pp], ([, s, p, pg]: [string, string, number | undefined, number, number]) =>
                      getKrsMahasiswa({ search: s, prodi_id: p, page: pg, per_page: pp }));
                  } else if (item.href === "/admin-universitas/user") {
                    if (user.universitas_id) {
                      preload(["/fakultas", user.universitas_id], ([, univId]: [string, number]) =>
                        getFakultas({ universitas_id: univId, per_page: 100 }));
                    }
                  } else if (item.href === "/admin-universitas/log") {
                    const pp = calcPerPage(52, 1, 310);
                    preload(["/audit", "", "", "", 1, pp], () =>
                      getAudits({ page: 1, per_page: pp }));
                  // — pmb —
                  } else if (item.href === "/pmb") {
                    preload("/dashboard/mahasiswa", getMahasiswaDashboard);
                  }
                }}
                prefetch
                className={`flex items-center rounded-lg text-sm transition-all ${
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                } ${isActive ? "text-white font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                style={isActive ? { backgroundColor: "var(--color-primary)" } : {}}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`${collapsed ? "px-1" : "px-4"} py-2 border-t border-gray-100 mt-auto`}>
          <button
            onClick={handleLogout}
            title={collapsed ? "Log Out" : undefined}
            className={`flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"} w-full py-2 text-sm text-gray-500 rounded-lg transition-colors hover:text-red-500 hover:bg-red-50 cursor-pointer`}
          >
            <LogOut size={18} />
            {!collapsed && "Log Out"}
          </button>
        </div>
        </div>{/* end inner scroll container */}
      </div>
    </>
  );
}
