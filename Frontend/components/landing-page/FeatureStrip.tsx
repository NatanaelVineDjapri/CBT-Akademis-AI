import { features } from "@/types/landing-page";

export default function FeatureStrip() {
  return (
    <section className="relative z-10 -mt-16 pb-12">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.t}
            className="rounded-2xl p-7 shadow-xl flex flex-col gap-4"
            style={{ backgroundColor: "var(--color-brand-ink)" }}
          >
            <span className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center shrink-0">
              <f.icon className="w-6 h-6" style={{ color: "var(--color-brand-ink)" }} strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="font-extrabold text-white text-[15px] mb-1.5">{f.t}</h3>
              <p className="text-sm leading-relaxed text-white/60">{f.d}</p>
            </div>
            <div className="mt-auto h-0.5 w-10 rounded-full bg-brand-yellow opacity-60" />
          </div>
        ))}
      </div>
    </section>
  );
}
