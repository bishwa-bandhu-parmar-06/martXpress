import api from "../axiosInstance";

export const addProductToCart = async (payload) => {
  const { data } = await api.post("/cart/add-to-cart", payload);
  return data;
};

export const getCart = async () => {
  const { data } = await api.get("/cart/get-all-cart-item");
  return data;
};

export const updateCartItemQuantity = async (productId, quantity) => {
  const { data } = await api.post(`/cart/update/${productId}`, {
    quantity,
  });
  return data;
};

export const removeCartItem = async (productId) => {
  const { data } = await api.post(`/cart/remove/${productId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.post("/cart/clear");
  return data;
};
