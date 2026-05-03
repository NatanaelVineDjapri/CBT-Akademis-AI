import api from "./api";

export const getMaintenanceStatus = async (): Promise<{ maintenance: boolean }> => {
  const res = await api.get("/settings/maintenance");
  return res.data;
};

export const toggleMaintenance = async (): Promise<{ maintenance: boolean; message: string }> => {
  const res = await api.post("/settings/maintenance");
  return res.data;
};
