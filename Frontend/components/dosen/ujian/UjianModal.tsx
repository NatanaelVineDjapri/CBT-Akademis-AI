"use client";

import useSWR from "swr";
import { useState } from "react";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import api from "@/services/api";
import { JENIS_BADGE, KESULITAN_BADGE, inputCls, labelCls } from "./constants";
import TambahSoalModal from "./TambahSoalModal";
import type { LocalSoalItem, MataKuliahOption, UjianForm, UjianSoalItem } from "./types";

export default function UjianModal({
  mode, initial, matkulList, onClose,
}: {
  mode: "create" | "edit";
  initial: UjianForm;
  matkulList: MataKuliahOption[];
  onClose: () => void;
}) {
  const [form, setForm]             = useState<UjianForm>(initial);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [step2, setStep2]           = useState(false);
  const [localSoal, setLocalSoal]   = useState<LocalSoalItem[]>([]);
  const [tab, setTab]               = useState<"detail" | "soal">("detail");
  const [showTambah, setShowTambah] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isCreateStep2 = mode === "create" && step2;
  const isOnSoalView  = isCreateStep2 || (mode === "edit" && tab === "soal");
  const soalUjianId   = mode === "edit" ? form.id : undefined;
  const soalMatkulId  = form.mata_kuliah_id ? Number(form.mata_kuliah_id) : null;

  const { data: soalData, mutate: mutateSoal } = useSWR(
    mode === "edit" && tab === "soal" && soalUjianId ? ["/ujian/soal/modal", soalUjianId] : null,
    () => api.get(`/ujian/dosen/${soalUjianId}/soal`).then(r => r.data),
    { revalidateOnFocus: false },
  );
  const soalList: UjianSoalItem[] = soalData?.data ?? [];

  const set = (k: keyof UjianForm, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const buildPayload = () => ({
    nama_ujian:     form.nama_ujian,
    mata_kuliah_id: Number(form.mata_kuliah_id),
    start_date:     form.start_date,
    end_date:       form.end_date,
    durasi_menit:   Number(form.durasi_menit),
    passing_grade:  form.passing_grade ? Number(form.passing_grade) : undefined,
    max_attempt:    form.max_attempt   ? Number(form.max_attempt)   : 1,
    is_kode_aktif:  form.is_kode_aktif,
    soal: localSoal.map(s => s.soal_id !== undefined
      ? { soal_id: s.soal_id, bobot: s.bobot }
      : {
          deskripsi:         s.deskripsi,
          jenis_soal:        s.jenis_soal,
          tingkat_kesulitan: s.tingkat_kesulitan,
          bab_id:            s.bab_id ?? null,
          opsi:              s.opsi,
          kunci:             s.kunci,
          bobot:             s.bobot,
          bank_soal_id:      s.bank_soal_id ?? null,
        }
    ),
  });

  const validate = () => {
    if (!form.nama_ujian || !form.mata_kuliah_id || !form.start_date || !form.end_date || !form.durasi_menit) {
      setError("Nama, mata kuliah, jadwal, dan durasi wajib diisi."); return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validate()) return;
    setError("");
    setStep2(true);
  };

  const handleCreateFinal = async () => {
    setSaving(true); setError("");
    try {
      await api.post("/ujian/dosen", buildPayload());
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal menyimpan.");
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setSaving(true); setError("");
    try {
      await api.put(`/ujian/dosen/${form.id}`, buildPayload());
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal menyimpan.");
    } finally { setSaving(false); }
  };

  const handleDeleteSoal = async (ujianSoalId: number) => {
    if (!confirm("Hapus soal ini dari ujian?")) return;
    setDeletingId(ujianSoalId);
    try {
      await api.delete(`/ujian/dosen/${soalUjianId}/soal/${ujianSoalId}`);
      mutateSoal();
    } catch { alert("Gagal menghapus soal."); }
    finally { setDeletingId(null); }
  };

  const handleAddLocal = (items: LocalSoalItem[]) => {
    setLocalSoal(prev => {
      const existing = new Set(prev.map(s => s._localId));
      return [...prev, ...items.filter(i => !existing.has(i._localId))];
    });
  };

  const handleRemoveLocal = (localId: string) =>
    setLocalSoal(prev => prev.filter(s => s._localId !== localId));

  const handleLocalBobot = (localId: string, val: number) =>
    setLocalSoal(prev => prev.map(s => s._localId === localId ? { ...s, bobot: val } : s));

  const showDetailForm = !isCreateStep2 && (mode === "create" || tab === "detail");
  const headerTitle = mode === "create" ? (isCreateStep2 ? "Kelola Soal" : "Buat Ujian") : "Edit Ujian";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">{headerTitle}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === "edit" && (
          <div className="flex px-6 pt-3 pb-0 border-b border-gray-100 shrink-0 gap-1">
            {[
              { key: "detail" as const, label: "Detail" },
              { key: "soal"   as const, label: soalList.length > 0 ? `Soal (${soalList.length})` : "Soal" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer"
                style={tab === t.key
                  ? { backgroundColor: "var(--color-primary)", color: "white" }
                  : { color: "#6b7280" }}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {isCreateStep2 && (
          <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100 shrink-0">
            <p className="text-xs text-blue-700">
              Tambahkan soal ke ujian ini. Klik <strong>Simpan Ujian</strong> jika sudah selesai.
            </p>
          </div>
        )}

        {showDetailForm && (
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            <div>
              <label className={labelCls}>Nama Ujian</label>
              <input className={inputCls} placeholder="Cth: UTS Kalkulus 2025"
                value={form.nama_ujian} onChange={e => set("nama_ujian", e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Mata Kuliah</label>
              <select className={inputCls} value={form.mata_kuliah_id}
                onChange={e => set("mata_kuliah_id", e.target.value)}>
                <option value="">Pilih Mata Kuliah</option>
                {matkulList.map(m => (
                  <option key={m.id} value={m.id}>{m.kode} — {m.nama}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Mulai</label>
                <input type="datetime-local" className={inputCls}
                  value={form.start_date} onChange={e => set("start_date", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Selesai</label>
                <input type="datetime-local" className={inputCls}
                  value={form.end_date} onChange={e => set("end_date", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Durasi (menit)</label>
                <input type="number" min={1} className={inputCls}
                  value={form.durasi_menit} onChange={e => set("durasi_menit", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Passing Grade</label>
                <input type="number" min={0} max={100} className={inputCls}
                  value={form.passing_grade} onChange={e => set("passing_grade", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Maks Attempt</label>
                <input type="number" min={1} className={inputCls}
                  value={form.max_attempt} onChange={e => set("max_attempt", e.target.value)} />
              </div>
            </div>

            {mode === "edit" && form.kode_akses && (
              <div>
                <label className={labelCls}>Kode Akses</label>
                <input readOnly value={form.kode_akses}
                  className={inputCls + " bg-gray-50 cursor-text select-all"} />
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" className="accent-[var(--color-primary)] w-4 h-4"
                  checked={form.is_kode_aktif} onChange={e => set("is_kode_aktif", e.target.checked)} />
                <span className="text-sm text-gray-700">Aktifkan kode akses</span>
              </label>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          </div>
        )}

        {isOnSoalView && (
          <div className="flex-1 overflow-auto min-h-0 flex flex-col">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-medium px-5 py-3 w-10">#</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Soal</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-20">Jenis</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-20">Kesulitan</th>
                  {isCreateStep2 && <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-20">Bobot</th>}
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 w-14">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isCreateStep2 ? localSoal.map((item, idx) => (
                  <tr key={item._localId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-800 line-clamp-1">{item.deskripsi}</p>
                      {item.bab && <span className="text-xs text-gray-400">{item.bab}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {item.jenis_soal
                        ? <span className="text-xs font-medium" style={{ color: JENIS_BADGE[item.jenis_soal]?.color ?? "#6b7280" }}>{JENIS_BADGE[item.jenis_soal]?.label ?? item.jenis_soal}</span>
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {item.tingkat_kesulitan
                        ? <span className="text-xs font-medium" style={{ color: KESULITAN_BADGE[item.tingkat_kesulitan]?.color ?? "#6b7280" }}>{KESULITAN_BADGE[item.tingkat_kesulitan]?.label ?? item.tingkat_kesulitan}</span>
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" min={0} step={0.5} value={item.bobot}
                        onChange={e => handleLocalBobot(item._localId, Number(e.target.value))}
                        className="w-16 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-[var(--color-primary)]" />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleRemoveLocal(item._localId)}
                        className="cursor-pointer transition-colors" title="Hapus dari ujian">
                        <Trash2 size={14} className="text-red-400 hover:text-red-500" />
                      </button>
                    </td>
                  </tr>
                )) : soalList.map(item => (
                  <tr key={item.ujian_soal_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400">{String(item.urutan).padStart(2, "0")}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-800 line-clamp-1">{item.deskripsi ?? "-"}</p>
                      {item.bab && <span className="text-xs text-gray-400">{item.bab}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {item.jenis_soal
                        ? <span className="text-xs font-medium" style={{ color: JENIS_BADGE[item.jenis_soal]?.color ?? "#6b7280" }}>{JENIS_BADGE[item.jenis_soal]?.label ?? item.jenis_soal}</span>
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {item.tingkat_kesulitan
                        ? <span className="text-xs font-medium" style={{ color: KESULITAN_BADGE[item.tingkat_kesulitan]?.color ?? "#6b7280" }}>{KESULITAN_BADGE[item.tingkat_kesulitan]?.label ?? item.tingkat_kesulitan}</span>
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteSoal(item.ujian_soal_id)}
                        disabled={deletingId === item.ujian_soal_id}
                        className="cursor-pointer transition-colors" title="Hapus dari ujian">
                        {deletingId === item.ujian_soal_id
                          ? <Loader2 size={14} className="animate-spin text-red-400" />
                          : <Trash2 size={14} className="text-red-400 hover:text-red-500" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isCreateStep2 && localSoal.length === 0 && (
              <EmptyState message="Belum ada soal. Klik Tambah Soal untuk mulai." flat />
            )}
            {!isCreateStep2 && soalList.length === 0 && (
              <EmptyState message="Belum ada soal. Klik Tambah Soal untuk mulai." flat />
            )}
            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg mx-5 mb-3 px-3 py-2">{error}</p>}
          </div>
        )}

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
          {showDetailForm ? (
            <>
              <button onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-gray-50">
                Batal
              </button>
              <button onClick={mode === "create" ? handleNextStep : handleUpdate} disabled={saving}
                className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}>
                {saving
                  ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</>
                  : mode === "create" ? "Lanjut Tambah Soal →" : "Simpan"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowTambah(true)}
                className="flex items-center gap-1.5 border text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                <Plus size={14} />Tambah Soal
              </button>
              <div className="flex-1" />
              {isCreateStep2 ? (
                <button onClick={handleCreateFinal} disabled={saving}
                  className="text-white text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</>
                    : `Simpan Ujian${localSoal.length > 0 ? ` (${localSoal.length} soal)` : ""}`}
                </button>
              ) : (
                <button onClick={onClose}
                  className="text-white text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  Selesai
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showTambah && soalMatkulId && (
        <TambahSoalModal
          mode={isCreateStep2 ? "create" : "edit"}
          matkulId={soalMatkulId}
          ujianId={soalUjianId ? String(soalUjianId) : undefined}
          excludeIds={isCreateStep2 ? localSoal.filter(s => s.soal_id !== undefined).map(s => s.soal_id!) : undefined}
          onClose={() => setShowTambah(false)}
          onAdd={isCreateStep2 ? handleAddLocal : undefined}
          onSaved={!isCreateStep2 ? () => mutateSoal() : undefined}
        />
      )}
    </div>
  );
}
