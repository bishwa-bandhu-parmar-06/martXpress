import api from "../axiosInstance";

export const registerUsers = async (payload) => {
  const res = await api.post("/auth/register-users", payload);
  return res.data;
};
