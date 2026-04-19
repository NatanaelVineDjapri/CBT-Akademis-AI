import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-sunny">
      <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-brand-yellow/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-brand-teal/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28 grid md:grid-cols-[1.1fr_1fr] gap-16 items-center">
        <div>
          <p className="ak-eyebrow mb-5">Computer Based Testing</p>
          <h1 className="text-[44px] md:text-[58px] leading-[1.05] font-extrabold text-brand-ink">
            Ujian online kampus, <br />
            <span className="ak-hl">tanpa drama</span> teknis.
          </h1>
          <p className="mt-6 text-lg text-neutral-600 max-w-[560px]">
            Satu platform untuk bank soal, penjadwalan, pengawasan, dan
            penilaian — dipakai ratusan dosen tiap semester.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app" className="btn btn-primary btn-lg">Coba gratis 14 hari <ArrowRight className="w-4 h-4" /></Link>
            <a href="#proses" className="btn btn-ghost btn-lg">Lihat cara kerja</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
            {["Tanpa kartu kredit", "Setup &lt; 1 hari", "Support WhatsApp"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                <span dangerouslySetInnerHTML={{ __html: t }} />
              </li>
            ))}
          </ul>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="relative">
      <div className="rounded-2xl bg-white shadow-lg border border-neutral-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-neutral-200" />
          <span className="w-3 h-3 rounded-full bg-neutral-200" />
          <span className="w-3 h-3 rounded-full bg-neutral-200" />
          <span className="ml-auto text-xs font-mono text-neutral-400">ujian.akademis.ai</span>
        </div>
        <div className="rounded-xl bg-surface-ocean p-5">
          <div className="text-xs font-bold tracking-widest text-brand-teal">UTS · BASIS DATA</div>
          <div className="mt-2 text-xl font-extrabold text-brand-ink">Soal 12 dari 30</div>
          <div className="mt-4 h-2 rounded-full bg-white overflow-hidden">
            <div className="h-full w-[40%] bg-brand-yellow" />
          </div>
          <p className="mt-5 text-sm text-neutral-700">
            Manakah bentuk normalisasi yang menghilangkan <em>partial dependency</em> pada kunci komposit?
          </p>
          <div className="mt-4 space-y-2">
            {["1NF", "2NF", "3NF", "BCNF"].map((o, i) => (
              <label key={o} className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold cursor-pointer ${i===1?"border-brand-yellow bg-brand-yellow/10 text-brand-ink":"border-neutral-200 bg-white text-neutral-700"}`}>
                <span className={`w-4 h-4 rounded-full border-2 ${i===1?"border-brand-yellow bg-brand-yellow":"border-neutral-300"}`} />
                {o}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 rounded-xl bg-brand-ink text-white text-xs font-semibold px-4 py-3 shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
        248 mahasiswa online
      </div>
      <div className="absolute -top-5 -right-3 rounded-xl bg-white shadow-md border border-neutral-100 px-4 py-3 text-xs">
        <div className="font-bold text-brand-ink">Nilai otomatis</div>
        <div className="text-neutral-500">dikirim ke PDDIKTI</div>
      </div>
    </div>
  );
}
