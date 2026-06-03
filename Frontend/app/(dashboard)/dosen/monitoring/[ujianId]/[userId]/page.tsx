"use client";

import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CalendarDays, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import { getMonitoringList, getMonitoringDetail, getMonitoringPesertaDetail } from "@/services/MonitoringServices";
import { toSlug } from "@/utils/slug";
import MonitoringPesertaSkeleton from "@/components/skeleton/MonitoringPesertaSkeleton";
import { getEcho } from "@/lib/echo";

type SortDir = "asc" | "desc";

function ColHeader<T extends string>({ label, col, sortBy, sortDir, onSort, className }: {
  label: string; col: T; sortBy: T; sortDir: SortDir; onSort: (col: T) => void; className?: string;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className={`text-center px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap ${className ?? ""}`} onClick={() => onSort(col)}>
      <span className="flex items-center justify-center gap-1">
        {label}
        <Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} />
      </span>
    </th>
  );
}

const VIOLATION_LABEL: Record<string, string> = {
  tab:            "Tab",
  fullscreen:     "Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "No Face",
  multiple_faces: "Multi Face",
  looking_away:   "Tengok",
};

const VIOLATION_LABEL_FULL: Record<string, string> = {
  tab:            "Pindah Tab",
  fullscreen:     "Keluar Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "Wajah Tidak Terdeteksi",
  multiple_faces: "Banyak Wajah",
  looking_away:   "Menengok",
};

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  sedang_berlangsung: { label: "Berlangsung", bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  selesai:            { label: "Selesai",     bg: "var(--color-primary-light)", color: "var(--color-primary)" },
  belum_mulai:        { label: "Belum Mulai", bg: "var(--akademik-tahun-bg)",   color: "var(--akademik-tahun-icon)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function MonitoringPesertaPage({ params }: { params: Promise<{ ujianId: string; userId: string }> }) {
  const { ujianId: ujianSlug, userId: pesertaSlug } = use(params);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const pidFromUrl   = searchParams.get("pid") ? Number(searchParams.get("pid")) : null;

  const uidFromUrl = searchParams.get("uid") ? Number(searchParams.get("uid")) : null;
  const eidFromUrl = searchParams.get("eid") ? Number(searchParams.get("eid")) : null;

  const { data: listData } = useSWR("/ujian/dosen/monitoring", getMonitoringList);
  const ujianMeta = listData?.data?.find(u => toSlug(u.nama_ujian) === ujianSlug);
  const ujianId   = ujianMeta?.id ?? eidFromUrl;

  const { data: detailData } = useSWR(
    ujianId ? `/ujian/dosen/monitoring/${ujianId}` : null,
    () => getMonitoringDetail(ujianId!),
  );
  const pesertaMeta = detailData?.peserta?.find(p => toSlug(p.nama ?? "") === pesertaSlug);
  const userId      = pesertaMeta?.user_id ?? uidFromUrl;

  const { data, mutate } = useSWR(
    ujianId && userId ? `/ujian/dosen/monitoring/${ujianId}/peserta/${userId}` : null,
    () => getMonitoringPesertaDetail(ujianId!, userId!),
    { revalidateOnFocus: true, refreshInterval: 10000 },
  );

  const [attemptSortBy, setAttemptSortBy] = useState<"violations" | "risk_score" | "attempt_ke">("attempt_ke");
  const [attemptSortDir, setAttemptSortDir] = useState<SortDir>("asc");
  const [pelanggaranSortDir, setPelanggaranSortDir] = useState<SortDir>("desc");
  const [jawabanSortBy, setJawabanSortBy] = useState<"nomor" | "nilai">("nomor");
  const [jawabanSortDir, setJawabanSortDir] = useState<SortDir>("asc");

  const handleAttemptSort = (col: "violations" | "risk_score" | "attempt_ke") => {
    const newDir: SortDir = col === attemptSortBy ? (attemptSortDir === "asc" ? "desc" : "asc") : "desc";
    setAttemptSortBy(col); setAttemptSortDir(newDir);
  };
  const handleJawabanSort = (col: "nomor" | "nilai") => {
    const newDir: SortDir = col === jawabanSortBy ? (jawabanSortDir === "asc" ? "desc" : "asc") : (col === "nilai" ? "desc" : "asc");
    setJawabanSortBy(col); setJawabanSortDir(newDir);
  };


  useEffect(() => {
    if (!ujianId) return;
    const echo = getEcho();
    if (!echo) return;
    const channel = echo.channel(`ujian.${ujianId}`);
    channel.listen(".pelanggaran-masuk", (e: { user_id?: number }) => {
      if (!e.user_id || e.user_id === userId) mutate();
    });
    channel.listen(".jawaban-masuk", (e: { user_id?: number }) => {
      if (!e.user_id || e.user_id === userId) mutate();
    });
    return () => { echo.leaveChannel(`ujian.${ujianId}`); };
  }, [ujianId, userId, mutate]);


  const peserta   = data?.peserta;
  const attempts  = data?.attempts ?? [];
  const summary   = data?.violation_summary ?? {};
  const totalSoal = data?.ujian.total_soal ?? 0;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb
        overrides={{
          [ujianSlug]:   ujianMeta?.nama_ujian ?? data?.ujian.nama_ujian ?? ujianSlug,
          [pesertaSlug]: peserta?.nama ?? pesertaSlug,
        }}
      />

      {!data && <MonitoringPesertaSkeleton />}


      {data && <>
      {/* Card 1: Riwayat Attempt */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate" style={{ color: "var(--color-primary)" }}>
              {peserta?.nama ?? "Loading..."}
            </h1>
            <p className="text-xs text-gray-400">{peserta?.nim ?? ""}</p>
          </div>
        </div>
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-semibold text-gray-700">Riwayat Attempt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium w-12">#</th>
                <th className="text-center px-4 py-3 font-medium w-24">Status</th>
                <th className="text-left px-4 py-3 font-medium w-36">Waktu</th>
                <th className="text-center px-4 py-3 font-medium w-20">Progress</th>
                {Object.keys(summary).map(type => (
                  <th key={type} className="text-center px-3 py-3 font-medium w-20">
                    {VIOLATION_LABEL[type] ?? type}
                  </th>
                ))}
                <ColHeader label="Total" col="violations" sortBy={attemptSortBy} sortDir={attemptSortDir} onSort={handleAttemptSort} className="w-20" />
                <ColHeader label="Risk Score" col="risk_score" sortBy={attemptSortBy} sortDir={attemptSortDir} onSort={handleAttemptSort} className="w-24" />
                <th className="text-center px-4 py-3 font-medium w-24">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attempts.length === 0 ? (
                <tr><td colSpan={4 + Object.keys(summary).length + 4} className="text-center py-8 text-sm text-gray-400">Belum ada data</td></tr>
              ) : [...attempts].sort((a, b) => {
                  if (a.status === "sedang_berlangsung" && b.status !== "sedang_berlangsung") return -1;
                  if (b.status === "sedang_berlangsung" && a.status !== "sedang_berlangsung") return 1;
                  const cmp = attemptSortBy === "violations" ? a.violations - b.violations
                            : attemptSortBy === "risk_score" ? a.risk_score - b.risk_score
                            : a.attempt_ke - b.attempt_ke;
                  return attemptSortDir === "asc" ? cmp : -cmp;
                }).map(a => (
                <tr key={a.attempt_ke} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">{String(a.attempt_ke).padStart(2, "0")}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays size={11} className="text-gray-400 shrink-0" />
                      <span>{a.mulai_at ?? "-"}</span>
                    </div>
                    {a.selesai_at && (
                      <div className="text-xs text-gray-400 mt-0.5 pl-3.5">s/d {a.selesai_at}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600">{a.soal_dijawab}/{totalSoal}</td>
                  {Object.keys(summary).map(type => {
                    const count = a.violation_breakdown?.[type] ?? 0;
                    return (
                      <td key={type} className="px-3 py-3 text-center">
                        {count > 0 ? (
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{count}x</span>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    {a.violations > 0 ? (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{a.violations}x</span>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{a.risk_score}</td>
                  <td className="px-4 py-3 text-center">
                    {a.foto_bukti?.length > 0 ? (
                      <Link
                        href={`/dosen/monitoring/${ujianSlug}/${pesertaSlug}/${a.attempt_ke}`}
                        className="text-xs font-medium hover:underline"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Lihat&nbsp;({a.foto_bukti.length})
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Total Pelanggaran per Jenis */}
      {Object.keys(summary).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Total Pelanggaran per Jenis</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium">Jenis Pelanggaran</th>
                <th className="text-center px-5 py-3 font-medium w-32 cursor-pointer select-none" onClick={() => setPelanggaranSortDir(d => d === "asc" ? "desc" : "asc")}>
                  <span className="flex items-center justify-center gap-1">
                    Jumlah
                    {pelanggaranSortDir === "desc" ? <ArrowDown size={11} className="text-gray-500" /> : <ArrowUp size={11} className="text-gray-500" />}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Object.entries(summary as Record<string, number>).sort(([, a], [, b]) => pelanggaranSortDir === "desc" ? b - a : a - b).map(([type, count]) => (
                <tr key={type} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-700">{VIOLATION_LABEL_FULL[type] ?? type}</td>
                  <td className="px-5 py-3 text-center w-32">
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{count}x</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Card 3: Jawaban per Attempt */}
      {attempts.map(a => a.jawaban?.length > 0 && (
        <div key={a.attempt_ke} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Jawaban Attempt {String(a.attempt_ke).padStart(2, "0")}
            </span>
            <span className="text-xs text-gray-400">{a.jawaban.length} soal dijawab</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <ColHeader label="No." col="nomor" sortBy={jawabanSortBy} sortDir={jawabanSortDir} onSort={handleJawabanSort} className="w-16" />
                  <th className="text-left px-4 py-3 font-medium">Jawaban</th>
                  <ColHeader label="Nilai" col="nilai" sortBy={jawabanSortBy} sortDir={jawabanSortDir} onSort={handleJawabanSort} className="w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...a.jawaban].sort((x, y) => {
                  const cmp = jawabanSortBy === "nilai" ? (x.nilai ?? 0) - (y.nilai ?? 0) : Number(x.nomor) - Number(y.nomor);
                  return jawabanSortDir === "asc" ? cmp : -cmp;
                }).map((j, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-center text-xs text-gray-400">{j.nomor}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 max-w-xs truncate">{j.jawaban ?? "-"}</td>
                    <td className="px-4 py-2.5 text-center">
                      {j.nilai != null ? (
                        <span className="text-xs font-semibold" style={{ color: (j.nilai ?? 0) >= 50 ? "var(--color-primary)" : "var(--color-danger)" }}>
                          {j.nilai}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      </>}

    </div>
  );
}
