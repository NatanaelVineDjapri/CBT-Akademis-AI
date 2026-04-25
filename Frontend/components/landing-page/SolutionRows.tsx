import { tabs, items, students, bars } from "@/types/landing-page";

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
      <span className="w-3 h-3 rounded-full bg-red-400" />
      <span className="w-3 h-3 rounded-full bg-brand-yellow" />
      <span className="w-3 h-3 rounded-full bg-green-400" />
      <span className="ml-3 flex-1 bg-white border border-neutral-200 rounded-md px-3 py-1 text-[11px] text-neutral-400 font-mono truncate">
        {url}
      </span>
    </div>
  );
}

function BankSoalMock() {  
  return (
    <div className="rounded-2xl bg-white shadow-xl border border-neutral-100 overflow-hidden">
      <BrowserBar url="cbt.akademis.ai/bank-soal" />
      <div className="p-5">
        <div className="flex gap-2 mb-5 flex-wrap">
          {tabs.map((tab, i) => (
            <span key={tab} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${i === 0 ? "bg-brand-ink text-white" : "border border-neutral-200 text-neutral-600"}`}>
              {tab}
            </span>
          ))}
        </div>
        <div className="divide-y divide-neutral-100">
          {items.map((item) => (
            <div key={item.t} className="flex items-center justify-between py-3 gap-4">
              <span className="text-sm font-semibold text-brand-ink">{item.t}</span>
              <div className="flex items-center gap-2 shrink-0 text-xs text-neutral-400">
                <span>{item.type} · {item.diff}</span>
                <span className="font-bold" style={{ color: "var(--color-brand-teal)" }}>{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PengawasanMock() {
  return (
    <div className="rounded-2xl bg-white shadow-xl border border-neutral-100 overflow-hidden">
      <BrowserBar url="cbt.akademis.ai/pengawasan" />
      <div className="p-5 grid grid-cols-2 gap-3">
        {students.map((s) => (
          <div key={s.name} className="relative rounded-xl p-4 flex items-end min-h-[80px]" style={{ backgroundColor: "var(--color-brand-ink)" }}>
            <span className="text-white text-sm font-semibold">{s.name}</span>
            <span className={`absolute top-2 right-2 ${s.color} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
              {s.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalitikMock() {

  return (
    <div className="rounded-2xl bg-white shadow-xl border border-neutral-100 overflow-hidden">
      <BrowserBar url="cbt.akademis.ai/analitik" />
      <div className="p-5">
        <p className="text-[10px] font-black tracking-widest text-neutral-400 uppercase mb-1">Rata-rata Kelas</p>
        <p className="text-4xl font-extrabold text-brand-ink mb-6">
          78.4<span className="text-base text-neutral-400 font-semibold">/100</span>
        </p>
        <div className="flex items-end gap-1.5 h-28">
          {bars.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-full rounded-t-md ${b.active ? "bg-brand-yellow" : "bg-blue-100"}`}
                style={{ height: `${b.h}%` }}
              />
              <span className="text-[10px] text-neutral-400">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const rows = [
  {
    tag: "Lorem Ipsum",
    t: "Lorem Ipsum Dolor Sit Amet Consectetur",
    bullets: [
      { color: "bg-orange-400", text: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt." },
      { color: "bg-blue-400",   text: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip commodo." },
    ],
    mock: <BankSoalMock />,
    reverse: false,
  },
  {
    tag: "Lorem Ipsum",
    t: "Consectetur Adipiscing Elit Sed Do Eiusmod",
    bullets: [
      { color: "bg-orange-400", text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat." },
      { color: "bg-blue-400",   text: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit." },
    ],
    mock: <PengawasanMock />,
    reverse: true,
  },
  {
    tag: "Lorem Ipsum",
    t: "Sed Do Eiusmod Tempor Incididunt Ut Labore",
    bullets: [
      { color: "bg-orange-400", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia." },
      { color: "bg-blue-400",   text: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci." },
    ],
    mock: <AnalitikMock />,
    reverse: false,
  },
];

export default function SolutionRow() {
  return (
    <section id="fitur" className="py-20">
      <div className="mx-auto max-w-[1200px] px-6 flex flex-col gap-24">
        {rows.map((r, i) => (
          <div
            key={i}
            className={`grid md:grid-cols-2 gap-16 items-center ${r.reverse ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: "var(--color-brand-teal)" }}>
                {r.tag}
              </p>
              <h2 className="text-[30px] md:text-[38px] font-extrabold text-brand-ink leading-[1.1] mb-6">
                {r.t}
              </h2>
              <ul className="space-y-4">
                {r.bullets.map((b) => (
                  <li key={b.text} className="flex items-start gap-3 text-[15px] text-neutral-600 leading-relaxed">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${b.color}`} />
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>{r.mock}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
