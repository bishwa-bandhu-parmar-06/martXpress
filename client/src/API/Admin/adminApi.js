import api from "../axiosInstance";
import { getAuthToken } from "../../utils/auth";
const token = getAuthToken("authToken");

export const registerAdmin = async (payload) => {
  const res = await api.post("/auth/register-admin", payload);
  return res.data;
};

export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getPendingAccountForSellers = async (payload) => {
  const res = await api.get("/admin/sellers/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getApprovedAccountOfSellers = async () => {
  const res = await api.get("/admin/sellers/approved", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getRejectededAccountOfSellers = async () => {
  const res = await api.get("/admin/sellers/rejected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const approveAccountOfSellers = async (sellerid) => {
  const res = await api.post(
    `/admin/sellers/${sellerid}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const rejectAccountOfSellers = async (sellerid) => {
  const res = await api.post(
    `/admin/sellers/${sellerid}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getSellersAccountBySellersId = async (payload) => {
  const res = await api.get("/admin/sellers/:sellerid", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteSellersAccountBySellersId = async (sellerid) => {
  const res = await api.post(
    `/admin/sellers/${sellerid}/remove`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getAdminDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
