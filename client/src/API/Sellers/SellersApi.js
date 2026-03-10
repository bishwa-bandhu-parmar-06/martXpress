import api from "../axiosInstance";

// ---------------------------------------------
// SELLER API FUNCTIONS
// ---------------------------------------------
export const registerSeller = async (sellerData) => {
  const response = await api.post("/auth/register-seller", sellerData);
  return response.data;
};

export const getSellersDetails = async () => {
  const response = await api.get("/sellers/seller-profile");
  return response.data;
};

export const updateSellerProfile = async (formData) => {
  // FIX: Changed from "/sellers/update-profile" to "/sellers/update-seller-details"
  const response = await api.post("/sellers/update-seller-details", formData, {
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
  const response = await api.post(`/sellers/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};
// ---------------------------------------------
// SELLER ADDRESS API FUNCTIONS
// ---------------------------------------------
export const getAllSellerAddresses = async () => {
  const response = await api.get("/sellers/all-seller-address");
  return response.data;
};

export const addSellerAddress = async (addressData) => {
  const response = await api.post("/sellers/add-seller-address", addressData);
  return response.data;
};

export const updateSellerAddress = async (addressId, addressData) => {
  const response = await api.post(
    `/sellers/update-seller-address/${addressId}`,
    addressData,
  );
  return response.data;
};

export const deleteSellerAddress = async (addressId) => {
  const response = await api.post(
    `/sellers/remove-seller-address/${addressId}`,
  );
  return response.data;
};

export const getSellerAnalyticsApi = async () => {
  const response = await api.get("/sellers/analytics");
  return response.data;
};
