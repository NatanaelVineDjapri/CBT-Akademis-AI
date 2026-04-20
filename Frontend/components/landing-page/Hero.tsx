import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-28">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-yellow/20 translate-x-1/3 -translate-y-1/4 pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28 grid md:grid-cols-[1fr_1.1fr] gap-10 items-center">
        <div>
          <p className="ak-eyebrow mb-5">Computer-Based Testing</p>
          <h1 className="text-[42px] md:text-[56px] leading-[1.08] font-extrabold text-brand-ink">
            Ujian Online Kampus,{" "}
            <span className="whitespace-nowrap">Tanpa Drama Koreksi</span>
          </h1>
          <p className="mt-5 text-[16px] text-neutral-600 max-w-[520px] leading-relaxed">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit architecto eveniet repellendus veniam, minus nulla quam dolore doloremque quibusdam, placeat voluptates culpa blanditiis atque aliquid dicta cum ut, dolorum dolores!
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app" className="btn btn-primary btn-lg">
              Ajukan Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#proses" className="btn btn-ghost btn-lg">Lihat Cara Kerjanya</a>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-neutral-600">
            <span className="w-2 h-2 rounded-full bg-semantic-success shrink-0" />
            Dipercaya 120+ kampus di Indonesia
          </div>
        </div>

        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  const options = [
    { l: "A", t: "Linear search",  sel: false },
    { l: "B", t: "Binary search",  sel: true  },
    { l: "C", t: "Bubble sort",    sel: false },
    { l: "D", t: "Hashing",        sel: false },
  ];

  return (
    <div className="relative ml-auto">
      {/* Yellow decorative tab on right edge */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-32 bg-brand-yellow rounded-r-2xl -z-10" />

      <div className="rounded-2xl bg-white shadow-xl border border-neutral-100 overflow-hidden">
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-brand-yellow" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 flex-1 bg-white border border-neutral-200 rounded-md px-3 py-1 text-[11px] text-neutral-400 font-mono truncate">
            cbt.akademis.ai/ujian/uts-basdat-2026
          </span>
        </div>

        {/* Exam UI */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <span className="bg-brand-ink text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Soal 7 · dari 40
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
              <Clock className="w-4 h-4 text-neutral-400" />
              58:22
            </span>
          </div>

          <p className="text-[13.5px] font-medium text-neutral-800 mb-4 leading-relaxed">
            Algoritma yang paling efisien untuk mencari nilai pada array terurut adalah...
          </p>

          <div className="space-y-2">
            {options.map((o) => (
              <div
                key={o.l}
                className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-semibold ${
                  o.sel
                    ? "border-brand-yellow bg-brand-yellow/15 text-brand-ink"
                    : "border-neutral-100 bg-neutral-50 text-neutral-700"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    o.sel ? "bg-brand-yellow text-brand-ink" : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {o.l}
                </span>
                {o.t}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full w-[17.5%] rounded-full bg-brand-yellow" />
            </div>
            <span className="text-xs text-neutral-500 shrink-0">7 / 40 dijawab</span>
          </div>
        </div>
      </div>
    </div>
  );
}
