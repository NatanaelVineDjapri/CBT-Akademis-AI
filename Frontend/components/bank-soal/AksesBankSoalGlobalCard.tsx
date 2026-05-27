import Link from "next/link";
import { preload } from "swr";
import { getBankSoalGlobal } from "@/services/BankSoalServices";
import { calcPerPage } from "@/hooks/usePerPage";

interface Props {
  href?: string;
}

export default function AksesBankSoalGlobalCard({
  href = "/bank-soal/global",
}: Props) {
  return (
    <div
      className="rounded-2xl px-6 py-5 flex flex-col items-center text-center"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <p className="text-sm font-bold text-white mb-0.5">
        Akses Bank Soal Global
      </p>
      <p className="text-xs text-white/70 mb-3">
        Telusuri koleksi soal dari berbagai dosen
      </p>
      <Link
        href={href}
        className="bg-white text-xs font-medium px-5 py-1 rounded-full hover:opacity-90 transition-opacity"
        style={{ color: "var(--color-primary)" }}
        onMouseEnter={() => {
          const pp = calcPerPage(290, 4, 240);
          preload(
            ["/bank-soal/global", "", 1, pp],
            ([, s, p, perPg]: [string, string, number, number]) =>
              getBankSoalGlobal({ search: s, page: p, per_page: perPg }),
          );
        }}
      >
        Telusuri
      </Link>
    </div>
  );
}
