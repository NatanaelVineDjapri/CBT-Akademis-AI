import { Database, Shuffle, ShieldCheck, FileBarChart } from "lucide-react";

const rows = [
  { icon: Database, t: "Bank soal terpusat", d: "Simpan soal per mata kuliah, reusable antar semester, dengan tag taksonomi Bloom.", tag: "Bank Soal" },
  { icon: Shuffle, t: "Acak soal & opsi otomatis", d: "Setiap mahasiswa dapat urutan soal dan opsi yang berbeda — satu klik, selesai.", tag: "Anti-bocor" },
  { icon: ShieldCheck, t: "Pengawasan berbasis kamera", d: "AI proctoring mendeteksi tab-switch, wajah ganda, dan suara mencurigakan.", tag: "Proctoring" },
  { icon: FileBarChart, t: "Nilai otomatis ke SIAKAD", d: "Ekspor langsung ke SIAKAD & PDDIKTI. Tidak ada lagi rekap Excel manual.", tag: "Integrasi" },
];

export default function SolutionRow() {
  return (
    <section id="fitur" className="py-20 bg-surface-ocean">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="ak-eyebrow">Solusi Akademis.ai</p>
        <h2 className="mt-3 text-[36px] md:text-[44px] leading-[1.1] font-extrabold text-brand-ink max-w-[740px]">
          Satu platform, <span className="ak-hl">empat kerepotan</span> hilang.
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {rows.map((r) => (
            <article key={r.t} className="rounded-xl bg-white border border-neutral-100 p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-lg bg-brand-yellow/25 text-brand-ink grid place-items-center">
                  <r.icon className="w-5 h-5" strokeWidth={2.2} />
                </span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-brand-teal">{r.tag}</span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-brand-ink">{r.t}</h3>
              <p className="mt-2 text-[15px] text-neutral-600">{r.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
