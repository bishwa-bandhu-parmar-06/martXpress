import api from "../axiosInstance";

export const registerAdmin = async (payload) => {
  const res = await api.post("/auth/register-admin", payload);
  // console.log("Getting Reponse From Regsiter Users : ", res);
  return res.data;
};
