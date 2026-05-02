import api from "./api";

export interface AuditUser {
  id: number;
  nama: string;
  email: string;
  role: string;
}

export interface AuditItem {
  id: number;
  model: string;
  model_id: number;
  event: "created" | "updated" | "deleted" | string;
  keterangan: string;
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  user: AuditUser | null;
  ip_address: string | null;
  created_at: string;
}

export type AuditModel =
  | "user"
  | "nilai_akhir"
  | "ujian"
  | "peserta_ujian"
  | "soal"
  | "pmb_penerimaan";

export type AuditEvent = "created" | "updated" | "deleted";


export const getAudits = async (params?: {
  model?: AuditModel;
  event?: AuditEvent;
  user_id?: number;
}): Promise<AuditItem[]> => {
  const res = await api.get("/audit", { params });
  return res.data;
};

export const getAuditByModel = async (
  model: AuditModel,
  id: number
): Promise<AuditItem[]> => {
  const res = await api.get(`/audit/${model}/${id}`);
  return res.data;
};