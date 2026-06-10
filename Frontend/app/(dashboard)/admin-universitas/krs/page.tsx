"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Plus, Trash2, Package, X, Loader2, BookOpen, GraduationCap, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import SearchInput from "@/components/filtering/SearchInput";
import Pagination from "@/components/filtering/Pagination";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerPage } from "@/hooks/usePerPage";
import { useUser } from "@/context/UserContext";
import {
  getKrsMahasiswa,
  getKrsMahasiswaDetail,
  addKrsMatkul,
  removeKrsMatkul,
  applyKrsPackage,
  getSemesterCourses,
} from "@/services/KrsServices";
import { getProdi } from "@/services/AdminUserServices";
import type { KrsMahasiswaDetail, MataKuliah } from "@/types";

type KrsSortBy = "nama" | "tahun_masuk" | "matkul_count";
type SortDir = "asc" | "desc";

function ColHeader({ label, col, sortBy, sortDir, onSort }: {
  label: string; col: KrsSortBy; sortBy: KrsSortBy; sortDir: SortDir;
  onSort: (col: KrsSortBy) => void;
}) {
  const active = sortBy === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 cursor-pointer select-none whitespace-nowrap"
      onClick={() => onSort(col)}>
      <span className="flex items-center gap-1">{label}<Icon size={11} className={active ? "text-gray-500" : "text-gray-300"} /></span>
    </th>
  );
}

const TAHUN_AJARAN_OPTIONS = [
  "2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026", "2026/2027",
];

function getCurrentTahunAjaran() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startYear = month >= 8 ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
}

function KrsDetailModal({
  userId,
  onClose,
}: {
  userId: number;
  onClose: () => void;
}) {
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran());
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading } = useSWR(
    ["/krs/mahasiswa", userId],
    ([, id]) => getKrsMahasiswaDetail(id),
    { revalidateOnFocus: false }
  );

  const handleRemove = async (matkulId: number) => {
    await removeKrsMatkul(userId, matkulId);
    mutate(["/krs/mahasiswa", userId]);
  };

  type KrsEntry = NonNullable<typeof data>["krs"][number];
  const grouped: Record<number, KrsEntry[]> = {};
  if (data?.krs) {
    for (const k of data.krs) {
      const sem = k.semester ?? 0;
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push(k);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <div>
            <h3 className="text-base font-bold text-white">{data?.nama ?? "..."}</h3>
            <p className="text-xs text-white/70">{data?.nim ?? ""} · {data?.prodi ?? ""}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {isLoading ? (
            <div className="py-8 flex items-center justify-center text-gray-400 text-sm">
              <Loader2 size={18} className="animate-spin mr-2" /> Memuat...
            </div>
          ) : !data?.krs.length ? (
            <EmptyState message="Belum ada mata kuliah terdaftar." flat />
          ) : (
            Object.entries(grouped)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([sem, items]) => (
                <div key={sem}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {Number(sem) === 0 ? "Tanpa Semester" : `Semester ${sem}`}
                  </p>
                  <div className="space-y-1.5">
                    {items.map((k) => (
                      <div key={k.user_mata_kuliah_id}
                        className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{k.nama}</p>
                          <p className="text-xs text-gray-400">{k.kode} {k.sks ? `· ${k.sks} SKS` : ""} · {k.tahun_ajaran}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(k.mata_kuliah_id)}
                          className="ml-3 text-red-400 hover:text-red-500 shrink-0 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Tahun ajaran:</span>
            <select
              value={tahunAjaran}
              onChange={e => setTahunAjaran(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none"
            >
              {TAHUN_AJARAN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Plus size={14} />
            Tambah Matkul
          </button>
        </div>
      </div>

      {showAddModal && data && (
        <AddMatkulModal
          userId={userId}
          prodiId={data.prodi_id!}
          tahunAjaran={tahunAjaran}
          enrolledIds={data.krs.map(k => k.mata_kuliah_id)}
          onClose={() => setShowAddModal(false)}
          onAdded={() => { setShowAddModal(false); mutate(["/krs/mahasiswa", userId]); }}
        />
      )}
    </div>
  );
}

function AddMatkulModal({
  userId,
  prodiId,
  tahunAjaran,
  enrolledIds,
  onClose,
  onAdded,
}: {
  userId: number;
  prodiId: number;
  tahunAjaran: string;
  enrolledIds: number[];
  onClose: () => void;
  onAdded: () => void;
}) {
  const [semester, setSemester] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: courses } = useSWR(
    ["/krs/prodi-semester", prodiId, semester],
    ([, p, s]) => getSemesterCourses(p, s),
    { revalidateOnFocus: false }
  );

  const available = (courses ?? []).filter(c => !enrolledIds.includes(c.id));

  const toggle = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAdd = async () => {
    if (!selected.length) return;
    setLoading(true);
    try {
      await addKrsMatkul(userId, selected, tahunAjaran);
      onAdded();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-sm font-bold text-gray-800">Tambah Mata Kuliah</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="px-5 pt-4 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Semester</label>
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <button
                key={s}
                onClick={() => { setSemester(s); setSelected([]); }}
                className="px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors"
                style={semester === s
                  ? { backgroundColor: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }
                  : { borderColor: "#e5e7eb", color: "#6b7280" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-3 space-y-1.5">
          {!courses ? (
            <div className="py-4 text-center text-sm text-gray-400"><Loader2 size={16} className="animate-spin inline mr-1" />Memuat...</div>
          ) : available.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Semua matkul semester ini sudah terdaftar.</p>
          ) : (
            available.map(c => (
              <label key={c.id} className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2.5 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selected.includes(c.id)}
                  onChange={() => toggle(c.id)}
                  className="accent-[var(--color-primary)] w-4 h-4 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.nama}</p>
                  <p className="text-xs text-gray-400">{c.kode}{c.sks ? ` · ${c.sks} SKS` : ""}</p>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={handleAdd}
            disabled={!selected.length || loading}
            className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Tambah {selected.length > 0 ? `(${selected.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplyPackageModal({
  prodiId,
  prodiNama,
  onClose,
}: {
  prodiId: number;
  prodiNama: string;
  onClose: () => void;
}) {
  const [semester, setSemester] = useState(1);
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string } | null>(null);

  const { data: courses } = useSWR(
    ["/krs/prodi-semester", prodiId, semester],
    ([, p, s]) => getSemesterCourses(p, s),
    { revalidateOnFocus: false }
  );

  const handleApply = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await applyKrsPackage(prodiId, semester, tahunAjaran);
      setResult({ message: res.message });
    } catch {
      setResult({ message: "Gagal menerapkan paket." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <div>
            <h3 className="text-base font-bold text-white">Terapkan Paket Semester</h3>
            <p className="text-xs text-white/70 mt-0.5">{prodiNama}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Semester</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <button key={s} onClick={() => setSemester(s)}
                  className="px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors"
                  style={semester === s
                    ? { backgroundColor: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }
                    : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Tahun Ajaran</label>
            <select value={tahunAjaran} onChange={e => setTahunAjaran(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]">
              {TAHUN_AJARAN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {courses !== undefined && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-500 mb-2">
                {courses.length} mata kuliah akan dienroll ke semua mahasiswa di prodi ini:
              </p>
              {courses.length === 0
                ? <p className="text-xs text-gray-400">Tidak ada mata kuliah untuk semester ini.</p>
                : courses.map(c => (
                  <div key={c.id} className="flex items-center gap-2 py-1">
                    <BookOpen size={12} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-700">{c.nama} <span className="text-gray-400">({c.kode}{c.sks ? `, ${c.sks} SKS` : ""})</span></span>
                  </div>
                ))
              }
            </div>
          )}

          {result && (
            <p className="text-xs bg-green-50 text-green-700 rounded-lg px-3 py-2">{result.message}</p>
          )}
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
            Tutup
          </button>
          <button
            onClick={handleApply}
            disabled={loading || !courses?.length}
            className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Package size={14} />}
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KrsPage() {
  const { user } = useUser();
  const perPage = usePerPage(65, 1, 360);
  const [search, setSearch]   = useState("");
  const [prodiId, setProdiId] = useState<number | undefined>();
  const [page, setPage]       = useState(1);
  const [sortBy, setSortBy]   = useState<KrsSortBy>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [packageModal, setPackageModal] = useState<{ prodiId: number; prodiNama: string } | null>(null);

  const debouncedSearch = useDebounce(search);

  const handleSort = (col: KrsSortBy) => {
    const newDir: SortDir = col === sortBy ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    setSortBy(col);
    setSortDir(newDir);
    setPage(1);
  };

  useEffect(() => { setPage(1); }, [debouncedSearch, prodiId, perPage]);

  const { data: prodiData } = useSWR(
    user?.universitas_id ? ["/prodi/krs", user.universitas_id] : null,
    () => getProdi({ per_page: 200 }),
    { revalidateOnFocus: false }
  );

  const { data } = useSWR(
    ["/krs/mahasiswa", debouncedSearch, prodiId, page, perPage, sortBy, sortDir],
    ([, s, p, pg]) => getKrsMahasiswa({ search: s as string, prodi_id: p as number | undefined, page: pg as number, per_page: perPage, sort_by: sortBy, sort_dir: sortDir }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const prodis = prodiData?.data ?? [];
  const selectedProdi = prodis.find(p => p.id === prodiId);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0"><Breadcrumb /></div>

      <div className="flex-1">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
              Manajemen KRS
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Kelola enrollment mata kuliah mahasiswa.</p>
          </div>
          <div className="flex items-center gap-2">
            {prodiId && (
              <button
                onClick={() => setPackageModal({ prodiId, prodiNama: selectedProdi?.nama ?? "" })}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border cursor-pointer transition-colors whitespace-nowrap"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
              >
                <Package size={15} />
                Paket Semester
              </button>
            )}
            <select
              value={prodiId ?? ""}
              onChange={e => setProdiId(e.target.value ? Number(e.target.value) : undefined)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">Semua Prodi</option>
              {prodis.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
            <SearchInput value={search} onChange={setSearch} placeholder="Cari nama / NIM" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm table-fixed">
            <colgroup>
              <col className="w-12" />
              <col className="w-56" />
              <col className="w-48" />
              <col className="w-28" />
              <col className="w-36" />
              <col className="w-24" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">#</th>
                <ColHeader label="Mahasiswa" col="nama" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Program Studi</th>
                <ColHeader label="Angkatan" col="tahun_masuk" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <ColHeader label="Matkul Terdaftar" col="matkul_count" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {!data ? Array.from({ length: perPage }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 animate-pulse">
                  <td className="px-5 py-3"><div className="h-3 bg-gray-100 rounded w-6" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-40 mb-1.5" /><div className="h-2.5 bg-gray-100 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-12" /></td>
                  <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-24" /></td>
                  <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded-lg w-16" /></td>
                </tr>
              )) : data.data.map((item, idx) => {
                const rowNum = String(((data.meta.current_page - 1) * data.meta.per_page) + idx + 1).padStart(2, "0");
                return (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400">{rowNum}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: "var(--color-primary)" }}>{item.nama}</p>
                      {item.nim && <p className="text-xs text-gray-400 mt-0.5">{item.nim}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.prodi ?? "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tahun_masuk ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                        <GraduationCap size={11} />
                        {item.matkul_count} matkul
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedUserId(item.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                        style={{ color: "var(--color-primary)", backgroundColor: "var(--color-primary-light)" }}
                      >
                        Atur KRS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {data?.data.length === 0 && <EmptyState message="Tidak ada mahasiswa." flat />}
        </div>
      </div>
      </div>

      {data?.meta && data.meta.last_page > 1 && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          total={data.meta.total}
          perPage={data.meta.per_page}
          onPageChange={setPage}
        />
      )}

      {selectedUserId !== null && (
        <KrsDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {packageModal && (
        <ApplyPackageModal
          prodiId={packageModal.prodiId}
          prodiNama={packageModal.prodiNama}
          onClose={() => setPackageModal(null)}
        />
      )}
    </div>
  );
}
