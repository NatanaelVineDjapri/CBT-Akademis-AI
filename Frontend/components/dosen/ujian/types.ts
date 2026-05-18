export interface UjianItem {
  id: number;
  nama_ujian: string;
  mata_kuliah: string | null;
  mata_kuliah_id: number | null;
  start_date: string | null;
  end_date: string | null;
  durasi_menit: number;
  jumlah_soal: number;
  jumlah_peserta: number;
  passing_grade: number | null;
  kode_akses: string | null;
  is_kode_aktif: boolean;
  status: "belum_mulai" | "berlangsung" | "selesai";
}

export interface MataKuliahOption { id: number; nama: string; kode: string }

export interface UjianForm {
  id?: number;
  nama_ujian: string;
  mata_kuliah_id: string;
  start_date: string;
  end_date: string;
  durasi_menit: string;
  passing_grade: string;
  max_attempt: string;
  kode_akses: string;
  is_kode_aktif: boolean;
  proctoring_aktif: boolean;
}

export interface UjianSoalItem {
  ujian_soal_id: number;
  soal_id: number;
  urutan: number;
  bobot: number;
  deskripsi: string | null;
  bab: string | null;
  jenis_soal: string | null;
  tingkat_kesulitan: string | null;
  dari_bank_soal: string | null;
}

export interface LocalSoalItem {
  _localId: string;
  soal_id?: number;
  bobot: number;
  deskripsi: string;
  jenis_soal: string | null;
  tingkat_kesulitan: string | null;
  bab: string | null;
  bab_id?: number | null;
  opsi?: Record<string, string>;
  kunci?: string | string[];
  bank_soal_id?: number | null;
}

export interface AvailableSoalItem {
  id: number;
  deskripsi: string;
  bab: string | null;
  bab_id: number | null;
  jenis_soal: string | null;
  tingkat_kesulitan: string | null;
  bank_soal: string | null;
}

export interface BabOption { id: number; nama_bab: string; urutan: number }
export interface BankSoalOption { id: number; nama: string }

export const EMPTY_FORM: UjianForm = {
  nama_ujian: "", mata_kuliah_id: "", start_date: "", end_date: "",
  durasi_menit: "90", passing_grade: "60", max_attempt: "1",
  kode_akses: "", is_kode_aktif: false, proctoring_aktif: true,
};
