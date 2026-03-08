import api from "../axiosInstance";
// ---------------------------------------------
// SELLER API FUNCTIONS
// ---------------------------------------------
export const registerSeller = async (sellerData) => {
  const response = await api.post("/auth/register-seller", sellerData);
  return response.data;
};

export const getSellersDetails = async () => {
  // No headers needed! Axios sends the cookie automatically.
  const response = await api.get("/sellers/seller-profile");
  return response.data;
};

export const updateSellerProfile = async (formData) => {
  const response = await api.post("/sellers/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getSellerOrdersApi = async () => {
  const response = await api.get("/sellers/orders");
  return response.data;
};

export const updateSellerOrderStatusApi = async (orderId, status) => {
  const response = await api.put(`/sellers/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};
