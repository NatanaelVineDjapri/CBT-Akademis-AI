const quotes = [
  {
    q: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    n: "Lorem Ipsum Dolor",
    r: "Lorem Ipsum, Consectetur Adipiscing",
    initials: "LI",
  },
  {
    q: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
    n: "Consectetur Adipiscing",
    r: "Lorem Ipsum, Sed Do Eiusmod Tempor",
    initials: "CA",
  },
  {
    q: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.",
    n: "Sed Do Eiusmod",
    r: "Lorem Ipsum, Incididunt Ut Labore",
    initials: "SE",
  },
];

export default function Testimonials() {
  return (
    <section id="testimoni" className="py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-14">
          <p className="ak-eyebrow mb-4">Suara Kampus</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-brand-ink leading-[1.1]">
            Lorem Ipsum Dolor Sit Amet Consectetur
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <figure key={i} className="bg-white rounded-2xl border border-neutral-100 p-7 shadow-xs flex flex-col gap-5">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <text x="0" y="28" fontSize="40" fill="var(--color-brand-yellow)" fontWeight="900">"</text>
              </svg>

              <blockquote className="text-[15px] leading-relaxed text-neutral-700 flex-1">
                {q.q}
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                  style={{ backgroundColor: "var(--color-brand-teal)" }}
                >
                  {q.initials}
                </span>
                <div>
                  <div className="font-extrabold text-brand-ink text-sm">{q.n}</div>
                  <div className="text-xs text-neutral-500">{q.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
