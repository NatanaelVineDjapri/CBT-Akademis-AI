"use client";

import { useState } from "react";
import useSWR from "swr";
import { X, ShieldCheck, ShieldOff, Copy, Check } from "lucide-react";
import { setup2FA, enable2FA, disable2FA } from "@/services/AuthServices";

interface Props {
  mode: "enable" | "disable";
  onClose: () => void;
  onSuccess: () => void;
}

export default function TwoFactorModal({ mode, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"scan" | "verify" | "success">(
    mode === "enable" ? "scan" : "verify"
  );
  const { data: setupData } = useSWR(
    mode === "enable" ? "2fa/setup" : null,
    setup2FA,
    { revalidateOnFocus: false }
  );
  const qrCode = setupData?.qr_code ?? "";
  const secret = setupData?.secret ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "enable") {
        await enable2FA(code);
      } else {
        await disable2FA(code);
      }
      setStep("success");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Kode tidak valid!");
    } finally {
      setLoading(false);
    }
  };

  const isEnable = mode === "enable";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <h3 className="text-base font-bold text-white">
            {isEnable ? "Aktifkan 2FA" : "Nonaktifkan 2FA"}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* ── SCAN STEP ── */}
          {step === "scan" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Scan QR code berikut menggunakan aplikasi{" "}
                <span className="font-medium text-gray-700">Google Authenticator</span> atau
                aplikasi autentikator lainnya.
              </p>

              {/* QR Code */}
              <div className="flex justify-center">
                {qrCode ? (
                  <img
                    src={`data:image/svg+xml;base64,${qrCode}`}
                    alt="QR Code 2FA"
                    className="w-44 h-44 rounded-xl border border-gray-100"
                  />
                ) : (
                  <div className="w-44 h-44 rounded-xl bg-gray-100 animate-pulse" />
                )}
              </div>

              {/* Secret key */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Atau masukkan kode manual:</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="flex-1 text-xs font-mono text-gray-700 tracking-wider break-all">
                    {secret || "Memuat..."}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 text-gray-400 hover:text-gray-600 transition"
                  >
                    {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep("verify")}
                disabled={!qrCode}
                className="w-full text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 cursor-pointer disabled:cursor-default"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Lanjut
              </button>
            </div>
          )}

          {/* ── VERIFY STEP ── */}
          {step === "verify" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, white)" }}
                >
                  {isEnable ? (
                    <ShieldCheck size={18} style={{ color: "var(--color-primary)" }} />
                  ) : (
                    <ShieldOff size={18} style={{ color: "var(--color-primary)" }} />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {isEnable
                    ? "Masukkan kode 6 digit dari aplikasi autentikator untuk mengaktifkan 2FA."
                    : "Masukkan kode 6 digit dari aplikasi autentikator untuk menonaktifkan 2FA."}
                </p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none tracking-widest text-center"
                autoFocus
              />

              {error && (
                <p className="text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                {isEnable && (
                  <button
                    type="button"
                    onClick={() => setStep("scan")}
                    className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer"
                  >
                    Kembali
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className={`${isEnable ? "hidden" : "flex-1"} border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg cursor-pointer`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 cursor-pointer disabled:cursor-default"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {loading
                    ? "Memproses..."
                    : isEnable
                    ? "Aktifkan"
                    : "Nonaktifkan"}
                </button>
              </div>
            </form>
          )}

          {/* ── SUCCESS STEP ── */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, white)" }}
              >
                {isEnable ? (
                  <ShieldCheck size={28} style={{ color: "var(--color-primary)" }} />
                ) : (
                  <ShieldOff size={28} style={{ color: "var(--color-primary)" }} />
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
                  {isEnable ? "2FA Berhasil Diaktifkan!" : "2FA Berhasil Dinonaktifkan!"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {isEnable
                    ? "Akun kamu sekarang lebih aman."
                    : "2FA telah dinonaktifkan dari akun kamu."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full text-white text-sm font-medium py-2.5 rounded-lg cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
