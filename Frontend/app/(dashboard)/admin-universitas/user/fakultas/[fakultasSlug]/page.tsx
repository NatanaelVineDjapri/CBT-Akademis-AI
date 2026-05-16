"use client";

import { use } from "react";
import useSWR, { preload } from "swr";
import Link from "next/link";
import { Users, GraduationCap } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import EmptyState from "@/components/EmptyState";
import { getFakultas, getProdi, getAdminUsers, type ProdiItem } from "@/services/AdminUserServices";
import { calcPerPage } from "@/hooks/usePerPage";
import { toSlug } from "@/utils/slug";

function ProdiCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 bg-gray-50 rounded-xl h-14" />
        <div className="flex-1 bg-gray-50 rounded-xl h-14" />
      </div>
    </div>
  );
}

function ProdiCard({ item, href, fakultasId }: { item: ProdiItem; href: string; fakultasId: number }) {
  return (
    <Link
      href={href}
      onMouseEnter={() => {
        const pp = calcPerPage(44, 1, 500);
        preload(["/users", String(item.id), "", "", 1, pp], () =>
          getAdminUsers({ prodi_id: item.id, per_page: pp, page: 1 }));
        preload(["/prodi", String(fakultasId)], () =>
          getProdi({ fakultas_id: fakultasId, per_page: 100 }));
      }}
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[var(--color-primary)] hover:shadow-md transition-all block">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs text-center leading-tight px-1"
          style={{ backgroundColor: "var(--color-primary)" }}>
          {item.kode}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate group-hover:text-[var(--color-primary)] transition-colors">
            {item.nama}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.total_dosen}</p>
          <p className="text-xs text-gray-400">Dosen</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-base font-bold" style={{ color: "var(--color-primary)" }}>{item.total_mahasiswa}</p>
          <p className="text-xs text-gray-400">Mahasiswa</p>
        </div>
      </div>
    </Link>
  );
}

export default function AdminUserProdiPage({ params }: { params: Promise<{ fakultasSlug: string }> }) {
  const { fakultasSlug } = use(params);

  const { data: allFakultas } = useSWR(
    "/fakultas/all",
    () => getFakultas({ per_page: 100 }),
    { revalidateOnFocus: false }
  );

  const fakultas = allFakultas?.data.find(f => toSlug(f.nama) === fakultasSlug);
  const fakultasId = fakultas?.id;
  const fakultasNama = fakultas?.nama ?? fakultasSlug;

  const { data } = useSWR(
    fakultasId ? ["/prodi", String(fakultasId)] : null,
    () => getProdi({ fakultas_id: fakultasId!, per_page: 100 }),
    { revalidateOnFocus: false }
  );

  const items = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <Breadcrumb hrefOverrides={{ [`/admin-universitas/user/fakultas/${fakultasSlug}`]: fakultasNama }} />
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold mb-1" style={{ color: "var(--color-primary)" }}>
          {fakultasNama}
        </h2>
        <p className="text-xs text-gray-400">Pilih program studi untuk melihat daftar user.</p>
      </div>

      {!data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => <ProdiCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <EmptyState message="Belum ada program studi." flat />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <ProdiCard
              key={item.id}
              item={item}
              href={`/admin-universitas/user/fakultas/${fakultasSlug}/prodi/${toSlug(item.nama)}`}
              fakultasId={fakultasId!}
            />
          ))}
        </div>
      )}
    </div>
  );
}
