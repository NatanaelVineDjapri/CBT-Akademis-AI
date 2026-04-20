import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white backdrop-blur border-b border-neutral-300 ">
      <div className="mx-auto max-w-[1200px] px-6 h-[68px] flex items-center justify-between gap-8">
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/">
            <Image
              src="/images/akademis-logo-horizontal.webp"
              alt="Akademis.ai"
              width={140}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <span className="hidden md:block text-sm font-bold text-brand-ink">CBT</span>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-neutral-600">
          <a href="#fitur" className="hover:text-brand-ink transition-colors">Fitur</a>
          <a href="#solusi" className="hover:text-brand-ink transition-colors">Solusi</a>
          <a href="#harga" className="hover:text-brand-ink transition-colors">Harga</a>
          <a href="#faq" className="hover:text-brand-ink transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-neutral-700 hover:text-brand-ink px-4 py-2 rounded-lg border border-neutral-200 transition-colors"
          >
            Masuk
          </Link>
          <Link href="/app" className="btn btn-primary text-sm">
            Ajukan Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="md:hidden p-2"><Menu className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );
}
