import api from "../axiosInstance";

export const registerUsers = async (payload) => {
  const res = await api.post("/auth/register-users", payload);
  console.log("Getting Reponse From Regsiter Users : ", res);
  return res.data;
};
