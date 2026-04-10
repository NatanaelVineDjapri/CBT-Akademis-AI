"use client";

import { User } from "@/types";
import { roleLabels} from "@/types";
import { CalendarDays, RefreshCw, ShieldCheck } from "lucide-react";

interface Props {
  user: User;
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function InfoAkunCard({ user }: Props) {
  const items = [
    {
      icon: CalendarDays,
      label: "Dibuat",
      value: formatDate(user.created_at),
      bg: "var(--info-akun-dibuat-bg)",
      color: "var(--info-akun-dibuat-icon)",
    },
    {
      icon: RefreshCw,
      label: "Terakhir diperbarui",
      value: formatDate(user.updated_at),
      bg: "var(--info-akun-updated-bg)",
      color: "var(--info-akun-updated-icon)",
    },
    {
      icon: ShieldCheck,
      label: "Role",
      value: roleLabels[user.role] ?? user.role,
      bg: "var(--info-akun-role-bg)",
      color: "var(--info-akun-role-icon)",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2
        className="text-lg font-bold mb-4"
        style={{ color: "var(--color-primary)" }}
      >
        Info Akun
      </h2>
      <div className="flex flex-col gap-3">
        {items.map(({ icon: Icon, label, value, bg, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
          >
            <div className="p-2 rounded-lg" style={{ background: bg }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm text-gray-700 font-medium truncate">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
