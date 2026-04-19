const quotes = [
  { q: "Sebelumnya kami kuliah di luar kota harus terbang cuma buat mengawasi UTS. Sekarang semua jalan dari rumah — waktu istri saya bertambah banyak.", n: "Dr. Hendra P.", r: "Dosen Informatika, Univ. Mataram" },
  { q: "Bank soal kami akhirnya rapi. Sekali bikin, dipakai sampai tiga semester. Efisiensi koreksi naik drastis.", n: "Ibu Sari Wulandari", r: "Kaprodi Manajemen, STIE Bandung" },
  { q: "Integrasi PDDIKTI-nya jalan mulus. Tim operator kami berkurang lembur-nya.", n: "Pak Agus Setiawan", r: "Wakil Rektor III, Univ. Sebelas Maret" },
];
export default function Testimonials() {
  return (
    <section id="testimoni" className="py-20 bg-surface-sunny">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="ak-eyebrow">Dari para pengguna</p>
        <h2 className="mt-3 text-[36px] md:text-[44px] font-extrabold text-brand-ink max-w-[720px] leading-[1.1]">
          Didesain bareng <span className="ak-hl">dosen</span>, bukan cuma untuk dosen.
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <figure key={q.n} className="rounded-xl bg-white border border-neutral-100 p-6 shadow-xs flex flex-col">
              <svg className="w-7 h-7 text-brand-yellow" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H7a2 2 0 0 0-2 2v2H3v-4a6 6 0 0 1 4-6zm10 0h4v4h-4a2 2 0 0 0-2 2v2h-2v-4a6 6 0 0 1 4-6z"/></svg>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-neutral-700 flex-1">{q.q}</blockquote>
              <figcaption className="mt-5 border-t border-neutral-100 pt-4">
                <div className="font-extrabold text-brand-ink">{q.n}</div>
                <div className="text-xs text-neutral-500">{q.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
