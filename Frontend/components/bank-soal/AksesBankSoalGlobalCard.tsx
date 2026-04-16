import Link from "next/link";

interface Props {
  href?: string;
}

export default function AksesBankSoalGlobalCard({ href = "/bank-soal/global" }: Props) {
  return (
    <div
      className="rounded-2xl px-6 py-8 flex flex-col items-center text-center"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <p className="text-base font-bold text-white mb-1">Akses Bank Soal Global</p>
      <p className="text-xs text-white/70 mb-4">
        Telusuri koleksi soal dari berbagai dosen
      </p>
      <Link
        href={href}
        className="bg-white text-sm font-medium px-6 py-1.5 rounded-full hover:opacity-90 transition-opacity"
        style={{ color: "var(--color-primary)" }}
      >
        Telusuri
      </Link>
    </div>
  );
}
