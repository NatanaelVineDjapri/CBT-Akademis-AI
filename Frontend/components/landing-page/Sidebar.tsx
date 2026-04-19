"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Database, Users, BarChart3, Settings } from "lucide-react";

const nav = [
  { g: "Utama", items: [
    { href: "/app", label: "Beranda", icon: Home },
    { href: "/app/ujian", label: "Ujian Saya", icon: FileText, badge: "4" },
    { href: "/app/bank-soal", label: "Bank Soal", icon: Database, badge: "1.2k" },
  ]},
  { g: "Kelola", items: [
    { href: "/app/mahasiswa", label: "Mahasiswa", icon: Users },
    { href: "/app/analitik", label: "Analitik", icon: BarChart3 },
    { href: "/app/pengaturan", label: "Pengaturan", icon: Settings },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[260px] shrink-0 border-r border-neutral-100 bg-white flex flex-col h-screen sticky top-0">
      <Link href="/" className="h-[72px] px-6 flex items-center gap-2 border-b border-neutral-100">
        <span className="w-8 h-8 rounded-lg bg-brand-yellow" />
        <span className="font-extrabold text-brand-ink">akademis<span className="text-brand-teal">.ai</span></span>
        <span className="ml-auto text-[10px] font-bold tracking-widest text-brand-teal bg-brand-teal-50 px-2 py-1 rounded">CBT</span>
      </Link>
      <nav className="flex-1 px-4 py-5 overflow-y-auto">
        {nav.map((g) => (
          <div key={g.g} className="mb-6">
            <div className="px-3 mb-2 text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-400">{g.g}</div>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = pathname === it.href || (it.href !== "/app" && pathname?.startsWith(it.href));
                return (
                  <li key={it.href}>
                    <Link href={it.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${active ? "bg-brand-yellow/20 text-brand-ink" : "text-neutral-600 hover:bg-neutral-50 hover:text-brand-ink"}`}>
                      <it.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      <span className="flex-1">{it.label}</span>
                      {it.badge && <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{it.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-neutral-100 p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-teal text-white grid place-items-center text-xs font-bold">RK</div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-brand-ink">Dr. Rina K.</div>
          <div className="text-xs text-neutral-500">Dosen · Informatika</div>
        </div>
      </div>
    </aside>
  );
}
