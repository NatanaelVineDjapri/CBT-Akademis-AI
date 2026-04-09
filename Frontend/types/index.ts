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
  tahun_masuk?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}


export interface JadwalEvent {
  id: string | number;
  title: string;
  mata_kuliah?: string;
  start: string;
  end?: string;
  status?: string;
}