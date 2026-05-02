import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section
      id="harga"
      className="relative py-24 overflow-hidden"
    >
      <div className="relative mx-auto max-w-[700px] px-6 text-center">
        <h2 className="text-[36px] md:text-[50px] font-extrabold text-brand-ink leading-[1.1] mb-5">
          Siap Menjalankan Ujian yang Tertata?
        </h2>
        <p className="text-[15px] text-neutral-600 max-w-[480px] mx-auto leading-relaxed mb-8">
          Lihat bagaimana CBT Akademis.ai bekerja di kampus Anda — demo gratis, tanpa komitmen.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/app" className="btn btn-primary btn-lg">
            Jadwalkan Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="mailto:hello@akademis.ai" className="btn btn-ghost btn-lg">
            Hubungi Tim
          </a>
        </div>
      </div>
    </section>
  );
}
