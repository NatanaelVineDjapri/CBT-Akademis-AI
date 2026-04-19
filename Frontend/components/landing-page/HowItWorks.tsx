const steps = [
  { n: "01", t: "Upload bank soal", d: "Impor dari Excel, Word, atau ketik langsung. Semua ter-tag otomatis per mata kuliah." },
  { n: "02", t: "Jadwalkan ujian", d: "Pilih kelas, atur durasi, tentukan aturan pengawasan — dalam 3 klik." },
  { n: "03", t: "Mahasiswa kerjakan", d: "Akses via browser atau mobile. Autosave tiap 10 detik, anti-koneksi putus." },
  { n: "04", t: "Nilai keluar sendiri", d: "Pilihan ganda dikoreksi instan. Esai dibantu AI grading, dosen tinggal validasi." },
];
export default function HowItWorks() {
  return (
    <section id="proses" className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="ak-eyebrow">Cara kerja</p>
        <h2 className="mt-3 text-[36px] md:text-[44px] font-extrabold text-brand-ink max-w-[700px] leading-[1.1]">
          Dari <span className="ak-hl">soal</span> ke nilai, dalam empat langkah.
        </h2>
        <ol className="mt-12 grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-xl border border-neutral-100 bg-neutral-25 p-6">
              <span className="font-mono text-sm font-bold text-brand-teal">{s.n}</span>
              <h3 className="mt-3 text-lg font-extrabold text-brand-ink">{s.t}</h3>
              <p className="mt-2 text-[14px] text-neutral-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
