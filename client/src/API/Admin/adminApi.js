import api from "../axiosInstance";

export const registerAdmin = async (payload) => {
  const res = await api.post("/auth/register-admin", payload);
  return res.data;
};

export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const getPendingAccountForSellers = async () => {
  const res = await api.get("/admin/sellers/pending");
  return res.data;
};

export const getApprovedAccountOfSellers = async () => {
  const res = await api.get("/admin/sellers/approved");
  return res.data;
};

export const getRejectededAccountOfSellers = async () => {
  const res = await api.get("/admin/sellers/rejected");
  return res.data;
};

export const approveAccountOfSellers = async (sellerid) => {
  const res = await api.post(`/admin/sellers/${sellerid}/approve`);
  return res.data;
};

export const rejectAccountOfSellers = async (sellerid) => {
  const res = await api.post(`/admin/sellers/${sellerid}/reject`);
  return res.data;
};

// Bonus fix: You had ":sellerid" hardcoded here. I fixed it to use the payload!
export const getSellersAccountBySellersId = async (sellerid) => {
  const res = await api.get(`/admin/sellers/${sellerid}`);
  return res.data;
};

export const deleteSellersAccountBySellersId = async (sellerid) => {
  const res = await api.post(`/admin/sellers/${sellerid}/remove`);
  return res.data;
};

export const getAdminDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};
