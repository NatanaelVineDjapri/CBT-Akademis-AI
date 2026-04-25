import { challenges } from "@/types/landing-page";

export default function Challenges() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle, #F2CC0C33 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #F2CC0C18 0%, transparent 70%)" }} />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #F2CC0C18 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[42px] font-extrabold text-brand-ink leading-[1.1]">
            Lorem Ipsum Dolor Sit Amet Consectetur
          </h2>
          <p className="mt-3 text-neutral-500 text-[15px] max-w-[520px] mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {challenges.map((c) => (
            <div key={c.t} className="bg-white rounded-2xl border border-neutral-100 p-7 shadow-xs">
              <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: "var(--color-brand-teal)" }}>
                {c.tag}
              </p>
              <h3 className="font-extrabold text-brand-ink text-[17px] leading-snug mb-5">
                {c.t}
              </h3>
              <ul className="space-y-2.5">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
