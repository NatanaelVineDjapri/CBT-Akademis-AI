"use client";

import { User } from "../../services/AuthServices";
import { Building2, BookOpen, CalendarDays, MapPin } from "lucide-react";

interface Props {
  user: User;
}

export default function AkademikCard({ user }: Props) {
  const items = [
    { icon: Building2,    label: "Universitas",   value: user.universitas_nama || user.universitas_kode || "-", bg: "var(--akademik-univ-bg)",  color: "var(--akademik-univ-icon)" },
    { icon: BookOpen,     label: "Program Studi", value: user.prodi_nama || "-",                                bg: "var(--akademik-prodi-bg)", color: "var(--akademik-prodi-icon)" },
    { icon: CalendarDays, label: "Tahun Ajaran",  value: user.tahun_masuk ? `${user.tahun_masuk}/${user.tahun_masuk + 1}` : "-",               bg: "var(--akademik-tahun-bg)", color: "var(--akademik-tahun-icon)" },
    { icon: MapPin,       label: "Alamat",        value: user.alamat || "-",                                   bg: "var(--akademik-alamat-bg)", color: "var(--akademik-alamat-icon)" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4" style={{ color: "#097797" }}>
        Informasi Akademik
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label, value, bg, color }) => (
          <div key={label} className="flex items-start gap-3 border border-gray-100 rounded-xl p-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: bg }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm text-gray-700 font-medium truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
