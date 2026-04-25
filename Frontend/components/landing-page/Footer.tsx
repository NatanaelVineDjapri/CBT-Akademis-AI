import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { links } from "@/types/landing-page";

export default function Footer() {
  return (
    <footer className="relative" style={{ backgroundColor: "var(--color-brand-ink)" }}>
      <div className="mx-auto max-w-[1200px] px-6 pt-14 pb-8 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 text-sm">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/akademis-logo-horizontal.webp"
              alt="Akademis.ai"
              width={140}
              height={36}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            Lorem Ipsum Head Office<br />
            Jl. Lorem Ipsum Dolor Sit Amet No. 1<br />
            Lorem Ipsum 12345
          </p>
          <p className="text-sm">
            <span className="font-semibold bg-gradient-to-r from-brand-yellow to-amber-300 bg-clip-text text-transparent">0811-2500-0060</span>
            <span className="text-white/40 mx-2">·</span>
            <span className="font-semibold bg-gradient-to-r from-brand-yellow to-amber-300 bg-clip-text text-transparent">marketing@akademis.ai</span>
          </p>
        </div>

        {/* Link columns */}
        {links.map((col) => (
          <div key={col.heading}>
            <p className="font-extrabold text-white mb-4">{col.heading}</p>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-[1200px] px-6 py-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
        <span>© 2026 akademis.ai — All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white/70 transition-colors">Terma</a>
          <a href="#" className="hover:text-white/70 transition-colors">Privasi</a>
        </div>
      </div>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white shadow-xl rounded-full pl-1 pr-4 py-1.5 border border-neutral-100">
        <span className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4" style={{ color: "var(--color-brand-ink)" }} />
        </span>
        <div className="leading-tight">
          <div className="text-[9px] font-bold uppercase tracking-wide text-neutral-400">AI Assistant</div>
          <div className="text-xs font-extrabold text-brand-ink">Tanya Kami</div>
        </div>
      </div>
    </footer>
  );
}
