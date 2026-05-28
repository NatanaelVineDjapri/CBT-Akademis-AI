"use client";

import { useState } from "react";
import useSWR from "swr";
import Breadcrumb from "@/components/BreadCrumb";
import Pagination from "@/components/filtering/Pagination";
import { getMaintenanceStatus, toggleMaintenance, getMaintenanceLogs } from "@/services/SettingsService";

const PER_PAGE = 15;

function ActionBadge({ action }: { action: "activated" | "deactivated" }) {
  return action === "activated"
    ? <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600">Diaktifkan</span>
    : <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-600">Dinonaktifkan</span>;
}

export default function MaintenancePage() {
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState(false);

  const { data: status, mutate: mutateStatus } = useSWR(
    "/settings/maintenance",
    getMaintenanceStatus,
    { revalidateOnFocus: false }
  );

  const { data: logs, mutate: mutateLogs } = useSWR(
    ["/settings/maintenance/logs", page],
    () => getMaintenanceLogs(page, PER_PAGE),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const isOn = status?.maintenance ?? false;

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await toggleMaintenance();
      mutateStatus({ maintenance: res.maintenance }, false);
      mutateLogs();
      setPage(1);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb />

      {/* Status + Toggle Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>Maintenance Break</h2>
            <p className="text-xs text-gray-400 mt-0.5">Kendalikan akses sistem untuk semua pengguna.</p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling || status === undefined}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50 transition-colors shrink-0"
            style={{ backgroundColor: isOn ? "#dc2626" : "var(--color-primary)" }}
          >
            {toggling ? "Memproses..." : isOn ? "Nonaktifkan Maintenance" : "Aktifkan Maintenance"}
          </button>
        </div>

        <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, white)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: isOn ? "#dc2626" : "var(--color-primary)" }}>
              {isOn ? "Maintenance Aktif" : "Sistem Berjalan Normal"}
            </p>
            <p className="text-xs mt-0.5 text-gray-500">
              {isOn ? "Semua pengguna tidak dapat mengakses sistem." : "Semua pengguna dapat mengakses sistem."}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Mengaktifkan mode Maintenance Break akan menonaktifkan sementara seluruh akses dan fitur sistem bagi semua pengguna, kecuali Admin Akademis AI.
        </p>

      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>Riwayat Maintenance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Log setiap perubahan status maintenance.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-12" />
              <col className="w-32" />
              <col />
              <col className="w-48" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">#</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Oleh</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {!logs ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-5 py-3"><div className="h-3 w-6 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-100 rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-40 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-32 bg-gray-100 rounded" /></td>
                  </tr>
                ))
              ) : logs.data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">Belum ada riwayat maintenance.</td>
                </tr>
              ) : logs.data.map((log, idx) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {String((page - 1) * PER_PAGE + idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800 font-medium truncate">{log.user_nama ?? "-"}</p>
                    <p className="text-xs text-gray-400 truncate">{log.user_email ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        lastPage={logs?.last_page ?? 1}
        total={logs?.total ?? 0}
        perPage={PER_PAGE}
        onPageChange={setPage}
      />
    </div>
  );
}
