"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { updatePassword } from "../../services/UserServices";

function PasswordField({
  label, value, onChange, show, onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-white ">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm text-gray-700 outline-none bg-white"
          required
        />
        <button type="button" onClick={onToggle} className="ml-2 text-gray-400">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export default function UbahPasswordModal({ onClose }: Props) {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [showLama, setShowLama] = useState(false);
  const [showBaru, setShowBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updatePassword({
        password_lama: passwordLama,
        password: passwordBaru,
        password_confirmation: konfirmasi,
      });
      setSuccess("Password berhasil diubah.");
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">Ubah Password</h3>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <PasswordField label="Password lama" value={passwordLama} onChange={setPasswordLama} show={showLama} onToggle={() => setShowLama(!showLama)} />
          <PasswordField label="Password baru" value={passwordBaru} onChange={setPasswordBaru} show={showBaru} onToggle={() => setShowBaru(!showBaru)} />
          <PasswordField label="Konfirmasi ulang password baru" value={konfirmasi} onChange={setKonfirmasi} show={showKonfirmasi} onToggle={() => setShowKonfirmasi(!showKonfirmasi)} />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
