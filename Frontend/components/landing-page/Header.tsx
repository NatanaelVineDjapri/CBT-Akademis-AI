import Link from "next/link";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-neutral-100">
      <div className="mx-auto max-w-[1200px] px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-ink font-extrabold text-lg">
          <span className="w-9 h-9 rounded-lg bg-brand-yellow grid place-items-center text-brand-ink">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 11h8M8 15h5"/></svg>
          </span>
          akademis<span className="text-brand-teal">.ai</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-700">
          <a href="#fitur">Fitur</a>
          <a href="#proses">Cara kerja</a>
          <a href="#testimoni">Testimoni</a>
          <a href="#harga">Harga</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/app/login" className="hidden sm:inline text-sm font-semibold text-neutral-700 hover:text-brand-ink">Masuk</Link>
          <Link href="/app" className="btn btn-primary text-sm">Coba gratis</Link>
          <button className="md:hidden p-2"><Menu className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );
}
