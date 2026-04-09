"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LABELS: Record<string, string> = {
  beranda: "Beranda",
  jadwal: "Jadwal",
  ujian: "Ujian",
  settings: "Settings",
  // tambah sesuai route lu
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-teal-600 font-medium">
      <Link href="/" className="hover:underline">Home</Link>
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-1">
            <span className="text-teal-400">›</span>
            {isLast ? (
              <span className="text-teal-400">{LABELS[seg] ?? seg}</span>
            ) : (
              <Link href={href} className="hover:underline">{LABELS[seg] ?? seg}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}