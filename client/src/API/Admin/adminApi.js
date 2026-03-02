import api from "../axiosInstance";

// ==========================================
// ADMIN AUTH & DASHBOARD
// ==========================================
export const registerAdmin = async (payload) => {
  const res = await api.post("/auth/register-admin", payload);
  return res.data;
};

export const getAdminDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};

// ==========================================
// ADMIN PROFILE & SETTINGS
// ==========================================
export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const updateAdminDetails = async (payload) => {
  const res = await api.post("/admin/update", payload);
  return res.data;
};

export const changeAdminPassword = async (payload) => {
  const res = await api.post("/admin/change-password", payload);
  return res.data;
};

// ==========================================
// SELLER MANAGEMENT
// ==========================================
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

export const getSellersAccountBySellersId = async (sellerid) => {
  const res = await api.get(`/admin/sellers/${sellerid}`);
  return res.data;
};

export const deleteSellersAccountBySellersId = async (sellerid) => {
  const res = await api.post(`/admin/sellers/${sellerid}/remove`);
  return res.data;
};

// ==========================================
// ADMIN PRODUCT MANAGEMENT
// ==========================================
export const getAllProductsForAdmin = async () => {
  const res = await api.get("/admin/get-all-products");
  return res.data;
};

export const deleteProductByAdmin = async (productId) => {
  const res = await api.post(`/admin/products/${productId}`);
  return res.data;
};

// ==========================================
// ADMIN ADDRESS MANAGEMENT
// ==========================================
export const addAdminAddress = async (payload) => {
  const res = await api.post("/admin/address/add", payload);
  return res.data;
};

export const getAllAdminAddresses = async () => {
  const res = await api.get("/admin/address/all");
  return res.data;
};

export const updateAdminAddress = async (addressId, payload) => {
  const res = await api.post(`/admin/address/update/${addressId}`, payload);
  return res.data;
};

export const removeAdminAddress = async (addressId) => {
  const res = await api.post(`/admin/address/remove/${addressId}`);
  return res.data;
};
