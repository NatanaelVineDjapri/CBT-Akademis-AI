import api from "./api";

export interface DashboardStats {
  ujian_selesai: number;
  ujian_akan_datang: number;
  rata_rata_nilai: number;
  nilai_tertinggi: number;
}

export interface DashboardUjianItem {
  peserta_ujian_id: number;
  ujian_id: number;
  nama: string;
  mata_kuliah: string;
  start_date: string;
  end_date: string;
}

export interface DashboardNilaiItem {
  nama: string;
  mata_kuliah: string;
  tanggal: string;
  nilai: number;
  grade: string;
  lulus: boolean;
}

export interface DashboardBulananItem {
  bulan: string;
  selesai: number;
  akan_datang: number;
}

export interface DashboardPerkembanganItem {
  bulan: string;
  rata: number;
  tertinggi: number;
  matkul_tinggi: string;
  matkul_rendah: string;
}

export interface MahasiswaDashboard {
  stats: DashboardStats;
  ujian_segera: DashboardUjianItem | null;
  ujian_akan_datang: DashboardUjianItem[];
  nilai_terbaru: DashboardNilaiItem[];
  ujian_per_bulan: DashboardBulananItem[];
  perkembangan_nilai: DashboardPerkembanganItem[];
}

export const getMahasiswaDashboard = async (): Promise<MahasiswaDashboard> => {
  const res = await api.get("/dashboard/mahasiswa");
  return res.data;
};
