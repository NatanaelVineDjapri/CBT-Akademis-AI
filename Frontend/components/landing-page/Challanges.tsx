const pains = [
  { t: "Koreksi manual berhari-hari", d: "Dosen masih harus membuka kertas jawaban satu per satu di akhir semester." },
  { t: "Soal bocor di grup WhatsApp", d: "Ujian yang sama dipakai ulang, sulit mendeteksi kebocoran soal lintas kelas." },
  { t: "Sistem CBT kampus sering error", d: "Saat jam ujian aktif, server kampus tumbang dan mahasiswa panik." },
  { t: "Laporan nilai tercecer di Excel", d: "Rekap ke SIAKAD dan PDDIKTI dikerjakan manual, rentan salah input." },
];
export default function Challenges() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="ak-eyebrow">Masalah yang biasa dihadapi</p>
        <h2 className="mt-3 text-[36px] md:text-[44px] leading-[1.1] font-extrabold text-brand-ink max-w-[720px]">
          Ujian seharusnya soal <span className="ak-hl">belajar</span>,<br /> bukan soal logistik.
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {pains.map((p) => (
            <div key={p.t} className="rounded-xl border border-neutral-100 bg-neutral-25 p-6 flex gap-4">
              <span className="ak-bullet ak-bullet-red mt-1"><span /></span>
              <div>
                <h3 className="text-lg font-extrabold text-brand-ink">{p.t}</h3>
                <p className="mt-1.5 text-[15px] text-neutral-600">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
