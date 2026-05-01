"use client";

import useSWR, { preload } from "swr";
import Link from "next/link";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import EmptyState from "@/components/EmptyState";
import { useUser } from "@/context/UserContext";
import { getFakultas, getProdi, type FakultasItem } from "@/services/AdminUserServices";

function FakultasCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 bg-gray-50 rounded-xl h-14" />
        ))}
      </div>
    </div>
  );
}

function FakultasCard({ item, href }: { item: FakultasItem; href: string }) {
  return (
    <Link
      href={href}
      onMouseEnter={() => {
        preload(["/prodi", String(item.id)], () => getProdi({ fakultas_id: item.id, per_page: 100 }));
        preload(["/fakultas/single", String(item.id)], () => getFakultas({ per_page: 100 }).then(r => r.data.find(f => f.id === item.id)));
      }}
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[var(--color-primary)] hover:shadow-md transition-all block">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {item.kode}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate group-hover:text-[var(--color-primary)] transition-colors">
            {item.nama}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.prodi_count}</p>
          <p className="text-xs text-gray-400">Prodi</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.total_dosen}</p>
          <p className="text-xs text-gray-400">Dosen</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.total_mahasiswa}</p>
          <p className="text-xs text-gray-400">Mahasiswa</p>
        </div>
      </div>
    </Link>
  );
}

export default function AdminUserFakultasPage() {
  const { user } = useUser();

  const { data } = useSWR(
    user?.universitas_id ? ["/fakultas", user.universitas_id] : null,
    ([, univId]) => getFakultas({ universitas_id: univId, per_page: 100 }),
    { revalidateOnFocus: false }
  );

  const items = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold mb-1" style={{ color: "var(--color-primary)" }}>
          Manajemen User
        </h2>
        <p className="text-xs text-gray-400">Pilih fakultas untuk melihat program studi dan daftar user.</p>
      </div>

      {!data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <FakultasCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <EmptyState message="Belum ada fakultas." flat />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <FakultasCard
              key={item.id}
              item={item}
              href={`/admin-universitas/user/fakultas/${item.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
