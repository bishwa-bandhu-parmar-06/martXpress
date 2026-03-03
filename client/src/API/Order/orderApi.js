import api from "../axiosInstance";

export const getMyOrdersApi = async () => {
  const res = await api.get("/order/my-orders");
  return res.data;
};

export const getOrderByIdApi = async (orderId) => {
  const res = await api.get(`/order/get-order/${orderId}`);
  return res.data;
};

export const cancelOrderApi = async (orderId) => {
  const res = await api.post(`/order/cancel-order/${orderId}`);
  return res.data;
};

export const requestReturnApi = async (orderId) => {
  const res = await api.post(`/order/return-order/${orderId}`);
  return res.data;
};
