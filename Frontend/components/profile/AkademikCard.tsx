"use client";

import useSWR from "swr";
import { User } from "@/types";
import {
  Building2,
  BookOpen,
  CalendarDays,
  MapPin,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";
import { getDosenMataKuliah } from "@/services/MataKuliahServices";

interface Props {
  user: User;
}

export default function AkademikCard({ user }: Props) {
  const isDosen = user.role === "dosen";

  const { data: dosenMatkul } = useSWR(
    isDosen ? "/mata-kuliah/dosen" : null,
    getDosenMataKuliah,
    { revalidateOnFocus: false }
  );

  const baseItems = [
    {
      icon: Building2,
      label: "Universitas",
      value: user.universitas_nama || user.universitas_kode || "-",
      bg: "var(--akademik-univ-bg)",
      color: "var(--akademik-univ-icon)",
    },
    {
      icon: GraduationCap,
      label: "Fakultas",
      value: user.fakultas_nama || "-",
      bg: "var(--akademik-fakultas-bg)",
      color: "var(--akademik-fakultas-icon)",
    },
    {
      icon: BookOpen,
      label: "Program Studi",
      value: user.prodi_nama || "-",
      bg: "var(--akademik-prodi-bg)",
      color: "var(--akademik-prodi-icon)",
    },
    ...(!isDosen
      ? [
          {
            icon: CalendarDays,
            label: "Tahun Ajaran",
            value: user.tahun_masuk
              ? `${user.tahun_masuk}/${user.tahun_masuk + 1}`
              : "-",
            bg: "var(--akademik-tahun-bg)",
            color: "var(--akademik-tahun-icon)",
          },
          {
            icon: BadgeCheck,
            label: "Status",
            value: user.status || "-",
            bg: "var(--akademik-status-bg)",
            color: "var(--akademik-status-icon)",
          },
        ]
      : []),
    {
      icon: MapPin,
      label: "Alamat",
      value: user.alamat || "-",
      bg: "var(--akademik-alamat-bg)",
      color: "var(--akademik-alamat-icon)",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4" style={{ color: "#097797" }}>
        Informasi Akademik
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {baseItems.map(({ icon: Icon, label, value, bg, color }) => (
          <div
            key={label}
            className="flex items-start gap-3 border border-gray-100 rounded-xl p-3"
          >
            <div className="p-4 rounded-lg" style={{ backgroundColor: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm text-gray-700 font-medium truncate">
                {value}
              </p>
            </div>
          </div>
        ))}

        {/* Mata Kuliah Diajar — full width, pills */}
        {isDosen && (
          <div className="sm:col-span-2 flex items-start gap-3 border border-gray-100 rounded-xl p-3">
            <div className="p-4 rounded-lg shrink-0 bg-purple-100">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 mb-2">Mata Kuliah Diajar</p>
              {dosenMatkul === undefined ? (
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-5 rounded-full bg-gray-100 animate-pulse"
                      style={{ width: `${80 + i * 24}px` }}
                    />
                  ))}
                </div>
              ) : dosenMatkul.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada</p>
              ) : (
                <div className="flex flex-wrap gap-1 max-h-5 overflow-y-auto">
                  {dosenMatkul.map((m, i) => (
                    <span key={m.id} className="text-sm text-gray-700 font-medium">
                      {m.nama}{i < dosenMatkul.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
