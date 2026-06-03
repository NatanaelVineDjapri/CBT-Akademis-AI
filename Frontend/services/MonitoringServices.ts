import api from "./api";

export interface MonitoringUjian {
  id: number;
  nama_ujian: string;
  mata_kuliah: string | null;
  start_date: string | null;
  end_date: string | null;
  durasi_menit: number;
  status: "berlangsung" | "selesai";
  peserta_aktif: number;
  total_peserta: number;
  total_violations: number;
  total_risk_score: number;
}

export interface MonitoringPeserta {
  peserta_ujian_id: number;
  user_id: number;
  nama: string | null;
  nim: string | null;
  status: string;
  attempt_ke: number;
  mulai_at: string | null;
  soal_dijawab: number;
  total_soal: number;
  violations: number;
  risk_score: number;
  violation_breakdown: Record<string, number>;
}

export interface MonitoringDetail {
  ujian: {
    id: number;
    nama_ujian: string;
    mata_kuliah: string | null;
    start_date: string | null;
    end_date: string | null;
    durasi_menit: number;
    total_soal: number;
  };
  peserta: MonitoringPeserta[];
}

export const getMonitoringList = (): Promise<{ data: MonitoringUjian[] }> =>
  api.get("/ujian/dosen/monitoring").then(r => r.data);

export const getMonitoringDetail = (ujianId: number): Promise<MonitoringDetail> =>
  api.get(`/ujian/dosen/monitoring/${ujianId}`).then(r => r.data);

export interface MonitoringPesertaDetail {
  peserta: { user_id: number; nama: string | null; nim: string | null };
  ujian:   { id: number; nama_ujian: string; total_soal: number };
  attempts: {
    peserta_ujian_id:    number;
    attempt_ke:          number;
    status:              string;
    mulai_at:            string | null;
    selesai_at:          string | null;
    soal_dijawab:        number;
    violations:          number;
    risk_score:          number;
    violation_breakdown: Record<string, number>;
    foto_bukti:          { url: string; tipe: string; risk_score: number; waktu: string }[];
    jawaban:             { nomor: number | string; jawaban: string | null; nilai: number | null }[];
  }[];
  violation_summary: Record<string, number>;
}

export const getMonitoringPesertaDetail = (ujianId: number, userId: number): Promise<MonitoringPesertaDetail> =>
  api.get(`/ujian/dosen/monitoring/${ujianId}/peserta/${userId}`).then(r => r.data);

export const getAdminMonitoringList = (): Promise<{ data: MonitoringUjian[] }> =>
  api.get("/ujian/admin-universitas/monitoring").then(r => r.data);

export const getAdminMonitoringDetail = (ujianId: number): Promise<MonitoringDetail> =>
  api.get(`/ujian/admin-universitas/monitoring/${ujianId}`).then(r => r.data);

export const getAdminMonitoringPesertaDetail = (ujianId: number, userId: number): Promise<MonitoringPesertaDetail> =>
  api.get(`/ujian/admin-universitas/monitoring/${ujianId}/peserta/${userId}`).then(r => r.data);
