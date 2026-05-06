"use client";

import useSWR from "swr";
import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { getAdminAkademisDashboard } from "@/services/DashboardServices";
import { getMaintenanceStatus, toggleMaintenance } from "@/services/SettingsService";
import { Building2, Users, ClipboardList, BookOpen, Plus, Trash2, Pencil, X } from "lucide-react";
import { getPengumuman, createPengumuman, updatePengumuman, deletePengumuman, type Pengumuman } from "@/services/PengumumanService";
import StatCard from "@/components/dashboard/admin-universitas/StatCard";
import DashboardSkeleton from "@/components/dashboard/admin-akademis/DashboardSkeleton";
import DistribusiPengguna from "@/components/dashboard/admin-akademis/DistribusiPengguna";
import AktivitasUjian from "@/components/dashboard/admin-akademis/AktivitasUjian";
import TingkatKelulusan from "@/components/dashboard/admin-akademis/TingkatKelulusan";
import TrenNilai from "@/components/dashboard/admin-akademis/TrenNilai";
import PertumbuhanPengguna from "@/components/dashboard/admin-akademis/PertumbuhanPengguna";


export default function AdminAkademisPage() {
  const { user } = useUser();
  const { data } = useSWR("/dashboard/admin-akademis", getAdminAkademisDashboard, { revalidateOnFocus: false });

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Welcome Back, {user?.nama ?? "Admin"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Dashboard Admin Akademis AI</p>
      </div>

      {!data ? <DashboardSkeleton /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Universitas" value={data.stats.total_universitas} icon={Building2}    color="#097797" />
          <StatCard label="Total Pengguna"    value={data.stats.total_pengguna}    icon={Users}        color="#22c55e" />
          <StatCard label="Total Ujian"       value={data.stats.total_ujian}       icon={ClipboardList} color="#a855f7" />
          <StatCard label="Total Bank Soal"   value={data.stats.total_bank_soal}   icon={BookOpen}     color="#f59e0b" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DistribusiPengguna />
        <AktivitasUjian />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TingkatKelulusan />
        <TrenNilai />
      </div>

      <PertumbuhanPengguna />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MaintenanceCard />
        <PengumumanCard />
      </div>
    </div>
  );
}

function MaintenanceCard() {
  const { data, mutate } = useSWR("/settings/maintenance", getMaintenanceStatus, { revalidateOnFocus: false });
  const [loading, setLoading] = useState(false);

  const isOn = data?.maintenance ?? false;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleMaintenance();
      mutate({ maintenance: res.maintenance }, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, white)" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-800">Maintenance Break</span>
      </div>

      {/* Status indicator */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, white)" }}>
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-primary)" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
            {isOn ? "Maintenance Aktif" : "Sistem Berjalan Normal"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-primary) 60%, white)" }}>
            {isOn ? "Semua pengguna tidak dapat mengakses sistem" : "Semua pengguna dapat mengakses sistem"}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed">
        Mengaktifkan mode Maintenance Break akan menonaktifkan sementara seluruh akses dan fitur sistem bagi semua pengguna, kecuali Admin Akademis AI.
      </p>

      {/* Action */}
      <button
        onClick={handleToggle}
        disabled={loading || data === undefined}
        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50 transition-colors mt-auto"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {loading ? "Memproses..." : isOn ? "Nonaktifkan Maintenance" : "Aktifkan Maintenance"}
      </button>
    </div>
  );
}

const roleOptions = [
  { value: "", label: "Semua Pengguna" },
  { value: "mahasiswa", label: "Mahasiswa" },
  { value: "dosen", label: "Dosen" },
  { value: "peserta_mahasiswa_baru", label: "Peserta PMB" },
];

type PForm = { judul: string; isi: string; target_role: string; expired_at: string };
const emptyPForm: PForm = { judul: "", isi: "", target_role: "", expired_at: "" };

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Semua</span>;
  const map: Record<string, string> = { mahasiswa: "Mahasiswa", dosen: "Dosen", peserta_mahasiswa_baru: "Peserta PMB" };
  const colors: Record<string, string> = { mahasiswa: "bg-blue-50 text-blue-600", dosen: "bg-purple-50 text-purple-600", peserta_mahasiswa_baru: "bg-amber-50 text-amber-600" };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${colors[role] ?? "bg-gray-100 text-gray-500"}`}>{map[role] ?? role}</span>;
}

function PengumumanCard() {
  const { data, mutate } = useSWR("/pengumuman", getPengumuman, { revalidateOnFocus: false });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Pengumuman | null>(null);
  const [form, setForm] = useState<PForm>(emptyPForm);
  const [loading, setLoading] = useState(false);

  const openAdd = () => { setEditItem(null); setForm(emptyPForm); setShowModal(true); };
  const openEdit = (item: Pengumuman) => {
    setEditItem(item);
    setForm({ judul: item.judul, isi: item.isi, target_role: item.target_role ?? "", expired_at: item.expired_at ? item.expired_at.slice(0, 16) : "" });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.isi.trim()) return;
    setLoading(true);
    try {
      if (editItem) {
        await updatePengumuman(editItem.id, { judul: form.judul, isi: form.isi, target_role: form.target_role || undefined, expired_at: form.expired_at || undefined });
      } else {
        await createPengumuman({ judul: form.judul, isi: form.isi, target_role: form.target_role || undefined, expired_at: form.expired_at || undefined });
      }
      await mutate();
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => { await deletePengumuman(id); mutate(); };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="text-sm font-semibold text-gray-800">Pengumuman</span>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--color-primary)" }}>
            <Plus size={13} /> Tambah
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 px-5">Judul & Isi</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 px-5 w-24">Target</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-2.5 px-5 w-24">Tanggal</th>
                <th className="pb-2.5 px-5 w-16" />
              </tr>
            </thead>
            <tbody>
              {!data ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {[1,2,3,4].map(j => <td key={j} className="py-3.5 px-5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-xs text-gray-400">Belum ada pengumuman.</td></tr>
              ) : data.map((item: Pengumuman, idx: number) => {
                const isLast = idx === data.length - 1;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${!isLast ? "border-b border-gray-100" : ""}`}>
                    <td className="py-3.5 px-5 max-w-xs">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.judul}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{item.isi}</p>
                    </td>
                    <td className="py-3.5 px-5"><RoleBadge role={item.target_role} /></td>
                    <td className="py-3.5 px-5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-green-500 hover:text-green-600 transition-colors cursor-pointer"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
              <h3 className="text-base font-bold text-white">{editItem ? "Edit Pengumuman" : "Tambah Pengumuman"}</h3>
              <button onClick={closeModal} className="text-white/70 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Judul</label>
                <input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul pengumuman"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Isi</label>
                <textarea value={form.isi} onChange={e => setForm(f => ({ ...f, isi: e.target.value }))} placeholder="Tulis isi pengumuman..." rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 resize-none outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Target Pengguna</label>
                <select value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[var(--color-primary)] transition-colors bg-white">
                  {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Expired At <span className="text-gray-400">(opsional)</span></label>
                <input type="datetime-local" value={form.expired_at} onChange={e => setForm(f => ({ ...f, expired_at: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={loading} className="flex-1 text-white py-2.5 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50" style={{ backgroundColor: "var(--color-primary)" }}>
                  {loading ? "Menyimpan..." : editItem ? "Simpan Perubahan" : "Unggah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
