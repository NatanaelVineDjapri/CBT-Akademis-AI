"use client";
import { useState, useEffect, useMemo } from "react";
import {
  getAudits,
  AuditItem,
  AuditModel,
  AuditEvent,
} from "@/services/AuditService";
import Breadcrumb from "@/components/BreadCrumb";

export default function SystemLog() {
  const [data, setData] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterModel, setFilterModel] = useState<AuditModel | "">("");
  const [filterEvent, setFilterEvent] = useState<AuditEvent | "">("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAudits({
          ...(filterModel ? { model: filterModel } : {}),
          ...(filterEvent ? { event: filterEvent } : {}),
        });
        setData(res);
      } catch {
        setError("Gagal memuat data audit.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filterModel, filterEvent]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (d) =>
        d.keterangan.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        (d.user?.nama ?? "").toLowerCase().includes(q)
    );
  }, [search, data]);

  const badgeClass = (event: string) => {
    if (event === "created")
      return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700";
    if (event === "updated")
      return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700";
    if (event === "deleted")
      return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700";
    return "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500";
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Breadcrumb */}
      <div className="shrink-0">
        <Breadcrumb />
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl px-7 pt-6 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-[var(--color-primary)] m-0">
            System Log
          </h2>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Filter Model */}
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value as AuditModel | "")}
              className="px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-500 outline-none bg-white cursor-pointer focus:border-[var(--color-primary)]"
            >
              <option value="">Semua Model</option>
              <option value="user">Pengguna</option>
              <option value="nilai_akhir">Nilai Akhir</option>
              <option value="ujian">Ujian</option>
              <option value="peserta_ujian">Peserta Ujian</option>
              <option value="soal">Soal</option>
              <option value="pmb_penerimaan">Penerimaan PMB</option>
            </select>

            {/* Filter Event */}
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value as AuditEvent | "")}
              className="px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-500 outline-none bg-white cursor-pointer focus:border-[var(--color-primary)]"
            >
              <option value="">Semua Event</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>

            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14" height="14" viewBox="0 0 14 14" fill="none"
              >
                <circle cx="6" cy="6" r="4.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" />
                <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 outline-none bg-white w-52 focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 text-red-600 rounded-lg mb-3 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 pl-0.5 border-b border-gray-200 w-[55%]">
                Keterangan
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 border-b border-gray-200 w-[12%]">
                Model
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 border-b border-gray-200 w-[10%]">
                Event
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 border-b border-gray-200 w-[23%]">
                Waktu & Aktor
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                  Memuat data...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                  Tidak ada log ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((log, i) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className={`text-sm text-gray-800 py-3.5 px-1.5 leading-relaxed ${i < filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
                    {log.keterangan}
                  </td>
                  <td className={`py-3.5 px-1.5 ${i < filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="text-xs text-gray-500">{log.model}</span>
                    <br />
                    <span className="text-xs text-gray-300">ID: {log.model_id}</span>
                  </td>
                  <td className={`py-3.5 px-1.5 ${i < filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className={badgeClass(log.event)}>{log.event}</span>
                  </td>
                  <td className={`py-3.5 px-1.5 ${i < filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="text-xs text-gray-500">{log.created_at}</span>
                    <br />
                    <span className="text-xs text-gray-400">
                      {log.user?.nama ?? "Sistem"}
                      {log.ip_address ? ` · ${log.ip_address}` : ""}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}