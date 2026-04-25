"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { shareByEmail } from "@/services/BankSoalServices";
import api from "@/services/api";
import type { BankSoalItem } from "@/types";

interface UserSuggestion {
  id: number;
  nama: string;
  email: string;
}

interface Props {
  item: BankSoalItem;
  onClose: () => void;
}

export default function ShareByEmailModal({ item, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!email || email.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const res = await api.get("/bank-soal/search-users", { params: { q: email } });
        setSuggestions(res.data.data);
        setShowDropdown(res.data.data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggest(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [email]);

  const handleSelect = (user: UserSuggestion) => {
    setEmail(user.email);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await shareByEmail(item.id, email);
      setSuccess(`Bank soal berhasil di-share ke ${email}`);
      setEmail("");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal share bank soal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <h3 className="text-base font-bold text-white">Share via Email</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "var(--color-primary-light)" }}>
            <p className="text-xs text-gray-500">Bank Soal</p>
            <p className="text-sm font-medium mt-0.5" style={{ color: "var(--color-primary)" }}>{item.nama}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email Penerima</label>
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  inputMode="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(""); }}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  placeholder="contoh@email.com"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none"
                />
                {loadingSuggest && (
                  <Loader2 size={14} className="animate-spin absolute right-3 top-3 text-gray-400" />
                )}
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-y-auto max-h-48">
                    {suggestions.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelect(u)}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-800">{u.nama}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">{success}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Share
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
