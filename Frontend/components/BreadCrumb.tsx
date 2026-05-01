"use client";
import { usePathname } from "next/navigation";
import { labels } from "@/types";
import Link from "next/link";

const SKIP_SEGMENTS = new Set(["dosen", "mahasiswa", "admin-universitas", "admin-akademis", "pmb", "fakultas", "prodi"]);

interface Props {
  overrides?: Record<string, string>;
  hrefOverrides?: Record<string, string>;
}

export default function Breadcrumb({ overrides, hrefOverrides }: Props = {}) {
  const pathname = usePathname();
  const fullSegments = pathname.split("/").filter(Boolean);

  const items = fullSegments.reduce<{ seg: string; href: string }[]>((acc, seg, idx) => {
    if (!SKIP_SEGMENTS.has(seg)) {
      acc.push({ seg, href: "/" + fullSegments.slice(0, idx + 1).join("/") });
    }
    return acc;
  }, []);

  return (
    <nav className="inline-flex items-center gap-1 text-xl font-bold px-4 py-2 rounded-xl"
      style={{ color: "var(--color-primary)" }}>
      <Link href="/" className="hover:underline" style={{ color: "var(--color-primary)" }}>Home</Link>
      {items.map(({ seg, href }, i) => {
        const isLast = i === items.length - 1;
        const label = hrefOverrides?.[href] ?? overrides?.[seg] ?? labels[seg] ?? seg;
        return (
          <span key={href + i} className="flex items-center gap-1">
            <span style={{ color: "var(--color-primary)" }}>»</span>
            {isLast ? (
              <span style={{ color: "var(--color-primary)" }}>{label}</span>
            ) : (
              <Link href={href} prefetch className="hover:underline" style={{ color: "var(--color-primary)" }}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}