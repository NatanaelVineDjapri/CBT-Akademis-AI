const steps = [
  { n: "01", t: "Lorem Ipsum Dolor",      d: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor." },
  { n: "02", t: "Consectetur Adipiscing", d: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi." },
  { n: "03", t: "Sed Do Eiusmod",         d: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore." },
];

export default function HowItWorks() {
  return (
    <section id="proses" className="py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-16">
          <p className="ak-eyebrow mb-4">Cara Kerja</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-brand-ink leading-[1.1]">
            Lorem ipsum dolor,{" "}
            <span
              className="underline decoration-brand-yellow decoration-[3px] underline-offset-[6px]"
              style={{ color: "var(--color-brand-yellow)" }}
            >
              Tiga Langkah
            </span>
            .
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="relative flex items-stretch">
              <div
                className="rounded-2xl p-7 flex-1 bg-white border border-brand-yellow/30"
              >
                <span
                  className="text-5xl font-extrabold block mb-5 leading-none"
                  style={{ color: "var(--color-brand-yellow)" }}
                >
                  {s.n}
                </span>
                <h3 className="text-lg font-extrabold text-brand-ink mb-2">{s.t}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{s.d}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8">
                  <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
                    <path d="M1 7h22M17 1l6 6-6 6" stroke="#F2CC0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 2"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
