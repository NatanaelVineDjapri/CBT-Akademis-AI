export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 py-12">
      <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 text-sm">
        <div>
          <div className="flex items-center gap-2 text-brand-ink font-extrabold text-lg">
            <span className="w-8 h-8 rounded-lg bg-brand-yellow" />akademis<span className="text-brand-teal">.ai</span>
          </div>
          <p className="mt-4 text-neutral-500 max-w-[320px]">Platform akademik untuk kampus Indonesia. Dibuat di Bandung & Yogyakarta.</p>
        </div>
        {[
          { t: "Produk", l: ["CBT", "PMB", "PDDIKTI", "AI Assistant"] },
          { t: "Perusahaan", l: ["Tentang", "Karier", "Blog", "Kontak"] },
          { t: "Dukungan", l: ["Pusat bantuan", "Status sistem", "Webinar dosen"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="font-bold text-brand-ink mb-3">{c.t}</div>
            <ul className="space-y-2 text-neutral-600">
              {c.l.map((x) => <li key={x}><a href="#">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-[1200px] px-6 mt-10 pt-6 border-t border-neutral-100 text-xs text-neutral-400 flex flex-wrap justify-between gap-2">
        <span>© 2026 Akademis.ai · PT Edukasi Cerdas Nusantara</span>
        <span>Kebijakan Privasi · Syarat Layanan</span>
      </div>
    </footer>
  );
}
