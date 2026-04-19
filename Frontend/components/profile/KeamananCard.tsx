"use client";

import { ShieldCheck, ShieldOff } from "lucide-react";
import type { User } from "@/types";

interface Props {
  user: User;
  onUbahPassword: () => void;
  onToggle2FA: () => void;
}

export default function KeamananCard({ user, onUbahPassword, onToggle2FA }: Props) {
  const is2faEnabled = user.google2fa_enabled ?? false;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-primary)" }}>
        Keamanan
      </h2>

      <div className="flex flex-col gap-4">
        {/* Password */}
        <div>
          <label className="text-xs text-gray-500">Password</label>
          <div className="flex gap-3 mt-1">
            <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 tracking-widest">
              ••••••••••••
            </div>
            <button
              onClick={onUbahPassword}
              className="text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Ubah Password
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* 2FA */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, white)" }}
            >
              {is2faEnabled ? (
                <ShieldCheck size={18} style={{ color: "var(--color-primary)" }} />
              ) : (
                <ShieldOff size={18} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: is2faEnabled ? "var(--color-primary)" : "#d1d5db" }}
                />
                <span className="text-xs" style={{ color: is2faEnabled ? "var(--color-primary)" : "#9ca3af" }}>
                  {is2faEnabled ? "Aktif" : "Tidak aktif"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onToggle2FA}
            className="text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shrink-0"
            style={
              is2faEnabled
                ? { border: "1px solid var(--color-primary)", color: "var(--color-primary)" }
                : { backgroundColor: "var(--color-primary)", color: "white" }
            }
          >
            {is2faEnabled ? "Nonaktifkan" : "Aktifkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
