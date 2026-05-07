"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import { me } from "@/services/AuthServices";
import { joinBankSoalByLink } from "@/services/BankSoalServices";

const rolePrefix: Record<string, string> = {
  dosen: "/dosen",
  admin_universitas: "/admin-universitas",
  admin_akademis_ai: "/admin-akademis",
  mahasiswa: "/mahasiswa",
  peserta_mahasiswa_baru: "/pmb",
};

const bankSoalPath = (role: string, id: number) =>
  `${rolePrefix[role] ?? "/dosen"}/bank-soal/${id}`;

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setError("Link tidak valid."); return; }

    me()
      .then((user) => joinBankSoalByLink(token).then((bankSoalId) => {
        router.replace(bankSoalPath(user.role, bankSoalId));
      }))
      .catch((err) => {
        if (err === null) return;
        if (err?.response?.status === 401) {
          router.replace(`/login?redirect=/bank-soal/join?token=${token}`);
          return;
        }
        setError(err?.response?.data?.message ?? "Link tidak valid atau sudah expired.");
      });
  }, [token, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-3 max-w-sm w-full text-center">
          <XCircle size={36} className="text-red-400" />
          <p className="text-sm font-semibold text-gray-800">{error}</p>
          <button
            onClick={() => router.replace("/")}
            className="mt-1 px-5 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
    </div>
  );
}

export default function JoinBankSoalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
      </div>
    }>
      <JoinContent />
    </Suspense>
  );
}
