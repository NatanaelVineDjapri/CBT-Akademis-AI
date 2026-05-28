import api from "./api";

export const getMaintenanceStatus = async (): Promise<{ maintenance: boolean }> => {
  const res = await api.get("/settings/maintenance");
  return res.data;
};

export const toggleMaintenance = async (): Promise<{ maintenance: boolean; message: string }> => {
  const res = await api.post("/settings/maintenance");
  return res.data;
};

export interface MaintenanceLogItem {
  id: number;
  action: "activated" | "deactivated";
  user_nama: string | null;
  user_email: string | null;
  created_at: string;
}

export const getMaintenanceLogs = async (page = 1, perPage = 15): Promise<{ data: MaintenanceLogItem[]; last_page: number; total: number }> => {
  const res = await api.get("/settings/maintenance/logs", { params: { page, per_page: perPage } });
  return res.data;
};
