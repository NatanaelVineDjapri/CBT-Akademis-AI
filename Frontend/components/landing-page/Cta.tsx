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
          Lorem Ipsum Dolor Sit Amet Consectetur?
        </h2>
        <p className="text-[15px] text-neutral-600 max-w-[480px] mx-auto leading-relaxed mb-8">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/app" className="btn btn-primary btn-lg">
            Lorem Ipsum <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="mailto:hello@akademis.ai" className="btn btn-ghost btn-lg">
            Dolor Sit Amet
          </a>
        </div>
      </div>
    </section>
  );
}
