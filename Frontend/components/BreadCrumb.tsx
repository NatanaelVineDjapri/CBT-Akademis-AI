"use client";
import { usePathname } from "next/navigation";
import { labels } from "@/types";
import Link from "next/link";

const SKIP_SEGMENTS = new Set(["dosen", "mahasiswa", "admin-universitas", "admin-akademis", "pmb"]);

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((s) => Boolean(s) && !SKIP_SEGMENTS.has(s));

  return (
    <nav className="inline-flex items-center gap-1 text-xl font-bold px-4 py-2 rounded-xl"
      style={{ color: "var(--color-primary)" }}>
      <Link href="/" className="hover:underline" style={{ color: "var(--color-primary)" }}>Home</Link>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const fullSegments = pathname.split("/").filter(Boolean);
        const segIndex = fullSegments.indexOf(seg);
        const href = "/" + fullSegments.slice(0, segIndex + 1).join("/");
        return (
          <span key={href} className="flex items-center gap-1">
            <span style={{ color: "var(--color-primary)" }}>»</span>
            {isLast ? (
              <span style={{ color: "var(--color-primary)" }}>{labels[seg] ?? seg}</span>
            ) : (
              <Link href={href} className="hover:underline" style={{ color: "var(--color-primary)" }}>{labels[seg] ?? seg}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}