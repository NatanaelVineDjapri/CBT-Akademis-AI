export interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  nim?: string;
  nidn?: string;
  no_telp?: string;
  alamat?: string;
  foto?: string | null;
  universitas_id?: number;
  universitas_kode?: string;
  universitas_nama?: string;
  prodi_id?: number;
  prodi_nama?: string;
  fakultas_id?: number;
  fakultas_nama?: string;
  tahun_masuk?: number;
  status?: 'aktif' | 'cuti' | 'non aktif';
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
  prodi_id: number;
  prodi?: { id: number; nama: string; fakultas?: { id: number; nama: string } };
  dosen_matkul?: { id: number; user_id: number; tahun_ajaran?: string; user: { id: number; nama: string; nidn?: string } }[];
}

export interface MataKuliahMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface UjianMahasiswa {
  peserta_ujian_id: number;
  ujian_id: number;
  nama_ujian: string;
  mata_kuliah: string;
  start_date: string;
  end_date: string;
  durasi_menit: number;
  passing_grade: number | null;
  status: "belum_mulai" | "sedang_berlangsung" | "selesai";
  attempt_ke: number;
  max_attempt: number | null;
  jumlah_soal: number;
  nilai: number | null;
  grade: string | null;
  lulus: boolean | null;
}

export interface UjianMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Nilai {
  id: number;
  nama_ujian: string;
  tanggal: string;
  pukul: string;
  nilai: number;
  grade: string;
  lulus: boolean;
}

export interface NilaiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface JadwalEvent {
  id: string | number;
  title: string;
  mata_kuliah?: string;
  start: string;
  end?: string;
  status?: string;
}
export const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const labels: Record<string, string> = {
  beranda: "Beranda",
  jadwal: "Jadwal",
  ujian: "Ujian",
  settings: "Settings",
};

export const roleLabels: Record<string, string> = {
  admin_akademis_ai: "Admin Akademis AI",
  admin_universitas: "Admin Universitas",
  dosen: "Dosen",
  mahasiswa: "Mahasiswa",
  peserta_mahasiswa_baru: "Peserta Mahasiswa Baru",
};

export const tips = [
  "Jangan bagikan password ke siapapun",
  "Gunakan kombinasi huruf, angka & simbol",
  "Logout setelah selesai menggunakan",
];
