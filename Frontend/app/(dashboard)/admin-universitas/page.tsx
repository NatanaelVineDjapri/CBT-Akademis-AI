'use client'

import useSWR from "swr";
import { useUser } from "../../../context/UserContext";
import { getAdminUniversitasDashboard } from "@/services/DashboardServices";
import { BookOpen, Clock, GraduationCap, LayoutGrid, Users, FileText, Bell } from "lucide-react";
import type { AdminUniversitasDashboard } from "@/types";
import Link from "next/link";
import StatistikPMBChart from "@/components/dashboard/admin-universitas/StatistikPMBChart";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, white)` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function UjianBerlangsungCard({ data }: { data: AdminUniversitasDashboard['ujian_berlangsung'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Ujian Sedang Berlangsung</span>
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Tidak ada ujian yang sedang berlangsung.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">{u.nama}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.mata_kuliah} · {u.jam}</p>
                {u.jumlah_peserta !== undefined && (
                  <p className="text-xs text-gray-400">{u.jumlah_peserta} peserta</p>
                )}
              </div>
              <Link
                href="/admin-universitas/ujian"
                className="text-xs text-white rounded-lg px-3 py-1.5 whitespace-nowrap"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Monitor
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BankSoalCard({ data }: { data: AdminUniversitasDashboard['bank_soal'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Bank Soal Terbaru</span>
        </div>
        {data.length > 0 && (
          <Link
            href="/admin-universitas/bank-soal"
            className="text-xs border rounded-lg px-3 py-1"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
          >
            Lihat Semua
          </Link>
        )}
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada bank soal.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-primary)" }}>
                  <BookOpen size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{b.nama}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{b.jumlah_soal} soal</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${b.permission === 'private' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {b.permission === 'private' ? 'Draft' : 'Publik'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UjianTerbaruCard({ data }: { data: AdminUniversitasDashboard['ujian_terbaru'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-800">Ujian Terbaru</span>
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada ujian.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{u.nama}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.mata_kuliah} · {u.start_date}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{u.jam}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PengumumanCard({ data }: { data: AdminUniversitasDashboard['pengumuman'] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-800">Pengumuman Aktif</span>
        </div>
        <Link
          href="/admin-universitas/pengumuman"
          className="text-xs border rounded-lg px-3 py-1"
          style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
        >
          Kelola
        </Link>
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-400">Belum ada pengumuman aktif.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((p) => (
            <div key={p.id} className="p-3 rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 6%, white)" }}>
              <p className="text-sm font-semibold text-gray-800">{p.judul}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.isi}</p>
              {p.expired_at && (
                <p className="text-xs text-gray-400 mt-1">Berakhir: {p.expired_at}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
      </div>
    </div>
  );
}

export default function AdminUniversitasDashboardPage() {
  const { user } = useUser();
  const { data } = useSWR("/dashboard/admin-universitas", getAdminUniversitasDashboard, { revalidateOnFocus: false });

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Welcome Back, {user?.nama ?? "Admin"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {user?.universitas_nama ?? "Dashboard Admin Universitas"}
        </p>
      </div>

      {!data ? <DashboardSkeleton /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Dosen" value={data.stats.total_dosen} icon={Users} color="#097797" />
            <StatCard label="Total Mahasiswa" value={data.stats.total_mahasiswa} icon={GraduationCap} color="#22c55e" />
            <StatCard label="Mata Kuliah" value={data.stats.total_matakuliah} icon={LayoutGrid} color="#a855f7" />
            <StatCard label="Total Ujian" value={data.stats.total_ujian} icon={FileText} color="#f59e0b" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UjianBerlangsungCard data={data.ujian_berlangsung} />
            <BankSoalCard data={data.bank_soal} />
          </div>

          <StatistikPMBChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UjianTerbaruCard data={data.ujian_terbaru} />
            <PengumumanCard data={data.pengumuman} />
          </div>
        </>
      )}
    </div>
  );
}
