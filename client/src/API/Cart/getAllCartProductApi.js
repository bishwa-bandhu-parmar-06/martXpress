import api from "../axiosInstance.js";

export const addProductToCart = async (payload) => {
  const response = await api.post("/api/cart/add-to-cart", payload);
  return response.data;
};

export const getAllCartProducts = async (usersId) => {
  const response = await api.post("/api/cart/get-all-cart-item", usersId);
  return response.data;
};

export const removeCartProducts = async (usersId) => {
  const response = await api.post(`/api/cart/remove/${productId}`, usersId);
  return response.data;
};

export const removeAllCartProducts = async (usersId) => {
  const response = await api.post(`/api/cart/clear/all`, usersId);
  return response.data;
};
