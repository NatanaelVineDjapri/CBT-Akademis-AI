const stats = [
  { k: "180+", v: "kampus pengguna" },
  { k: "2,4jt", v: "sesi ujian/thn" },
  { k: "99,98%", v: "uptime server" },
  { k: "< 1 hari", v: "setup rata-rata" },
];
export default function FeatureStrip() {
  return (
    <section className="border-y border-neutral-100 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.v} className="flex flex-col">
            <span className="text-3xl font-extrabold text-brand-ink">{s.k}</span>
            <span className="text-sm text-neutral-500 mt-1">{s.v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
