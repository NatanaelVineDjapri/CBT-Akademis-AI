import api from "./api";

export const updateProfile = async (formData: FormData): Promise<void> => {
  await api.post("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePassword = async (data: {
  password_lama: string;
  password: string;
  password_confirmation: string;
}): Promise<void> => {
  await api.put("/profile/password", data);
};
