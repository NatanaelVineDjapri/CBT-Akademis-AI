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

export interface BankSoalItem {
  id: number;
  nama: string;
  deskripsi?: string;
  permission: 'public' | 'shared' | 'private';
  created_by: number;
  mata_kuliah_id?: number;
  mata_kuliah?: { id: number; nama: string; kode: string; bab?: { id: number; nama_bab: string; urutan: number }[] };
  bab_id?: number | null;
  bab?: { id: number; nama_bab: string } | null;
  creator?: { id: number; nama: string; universitas?: { id: number; nama: string } };
  soal_count?: number;
}

export interface BankSoalMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface BabItem {
  id: number;
  nama_bab: string;
  urutan: number;
  jumlah_soal: number;
}

export interface MataKuliahDetail {
  id: number;
  nama: string;
  kode: string;
  dosen: string;
  total_bab: number;
  bab: BabItem[];
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

export interface GradeSettingItem {
  grade: string;
  nilai_min: number;
  nilai_max: number;
}

export interface NilaiDetailInfo {
  nama_ujian: string;
  mata_kuliah: string;
  tanggal: string;
  waktu: string;
  nilai: number;
  grade: string;
  lulus: boolean;
  grade_setting: GradeSettingItem[];
}

export interface JawabanPG {
  no: number;
  soal: string;
  kunci: string;
  jawaban: string;
  poin: number;
}

export interface JawabanCheckbox {
  no: number;
  soal: string;
  kunci: string;
  jawaban: string;
  poin: number;
}

export interface JawabanEssay {
  no: number;
  soal: string;
  jawaban: string;
  poin: number;
  ai_feedback: string | null;
}

export interface NilaiDetail {
  info: NilaiDetailInfo;
  jawaban: {
    pilihan_ganda: JawabanPG[];
    checklist: JawabanCheckbox[];
    essay: JawabanEssay[];
  };
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
  dosen: "Dosen",
  mahasiswa: "Mahasiswa",
  profile: "Profil",
  nilai: "Nilai",
  "mata-kuliah": "Mata Kuliah",
  "bank-soal": "Bank Soal",
  monitoring: "Monitoring",
  "hasil-ujian": "Hasil Ujian",
};

export const roleLabels: Record<string, string> = {
  admin_akademis_ai: "Admin Akademis AI",
  admin_universitas: "Admin Universitas",
  dosen: "Dosen",
  mahasiswa: "Mahasiswa",
  peserta_mahasiswa_baru: "Peserta Mahasiswa Baru",
};

export const tips = [
  "Jangan pernah membagikan password Anda kepada siapapun, termasuk pihak yang mengaku dari layanan resmi, karena hal ini bisa membahayakan keamanan akun Anda.",
  "Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol agar password lebih kuat dan tidak mudah ditebak oleh orang lain.",
  "Selalu logout setelah selesai menggunakan akun, terutama jika Anda memakai perangkat umum atau milik orang lain, untuk mencegah akses tanpa izin.",
];

export const quotes = [
  "Setiap langkah kecil yang kamu ambil hari ini adalah investasi untuk masa depanmu. Terus bergerak maju!",
  "Kesulitan bukan penghalang, melainkan batu loncatan menuju versi terbaik dirimu.",
  "Belajar itu bukan tentang seberapa cepat kamu selesai, tapi seberapa dalam kamu memahami.",
  "Hari ini adalah kesempatan baru untuk menjadi lebih baik dari kemarin. Manfaatkan sebaik-baiknya!",
  "Semangat yang konsisten mengalahkan bakat yang malas. Kamu sudah di jalur yang benar!",
  "Setiap soal yang kamu kerjakan menambah bekal untuk masa depan cerahmu.",
  "Jangan takut gagal — setiap kesalahan adalah guru terbaik yang tidak memungut bayaran.",
  "Proses tidak pernah mengkhianati hasil. Terus belajar dan percaya pada prosesmu!",
  "Kamu lebih kuat dari yang kamu kira, lebih pintar dari yang kamu percaya. Buktikan hari ini!",
  "Satu hari penuh usaha lebih berharga dari seribu hari penuh niat tanpa aksi.",
  "Impianmu layak diperjuangkan. Mulai dari yang kecil, konsisten setiap hari.",
  "Nilai bukan segalanya, tapi usaha terbaikmu selalu layak untuk diberikan.",
  "Setiap mata kuliah yang kamu kuasai membuka pintu kesempatan yang belum pernah kamu bayangkan.",
  "Rasa lelah yang kamu rasakan sekarang adalah bukti bahwa kamu sedang tumbuh.",
  "Sukses bukan milik yang paling berbakat, tapi milik yang paling pantang menyerah.",
  "Waktu yang kamu investasikan untuk belajar hari ini tidak akan pernah sia-sia.",
  "Kamu sedang menulis babak terbaik dalam hidupmu. Buat setiap halamannya berarti!",
  "Percayalah pada kemampuanmu. Kamu sudah sejauh ini — itu bukan kebetulan.",
  "Setiap ujian yang kamu hadapi adalah bukti bahwa kamu dipercaya untuk melewatinya.",
  "Tetap fokus, tetap semangat. Hasil terbaik menanti mereka yang tidak berhenti berusaha.",
];