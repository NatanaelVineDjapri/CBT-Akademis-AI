import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section id="harga" className="py-20 bg-brand-ink text-white">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
        <div>
          <p className="text-sm font-bold tracking-[0.18em] uppercase text-brand-yellow">Siap mulai?</p>
          <h2 className="mt-3 text-[36px] md:text-[48px] font-extrabold leading-[1.1]">
            Bawa ujian kampus ke <span className="text-brand-yellow">era 2026</span>.
          </h2>
          <p className="mt-4 text-white/70 max-w-[520px]">
            Coba gratis 14 hari untuk satu mata kuliah. Tanpa kartu kredit, tanpa kontrak panjang.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/app" className="btn btn-primary btn-lg">Mulai gratis <ArrowRight className="w-4 h-4" /></Link>
            <a href="mailto:hello@akademis.ai" className="btn btn-lg bg-white/10 text-white hover:bg-white/20 border-transparent">Jadwalkan demo</a>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Biaya per mahasiswa/semester</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold">Rp 12rb</span>
            <span className="text-white/60">/mhs</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {["Bank soal tak terbatas", "AI proctoring & AI grading", "Integrasi SIAKAD + PDDIKTI", "Support WhatsApp 07.00–22.00"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />{x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
