import api from "../axiosInstance.js";

export const addProductToWishList = async (productId) => {
  const response = await api.post("/api/wishlist/add-to-wishlist", productId);
  return response.data;
};

export const getAllWishlistProducts = async () => {
  const response = await api.post("/api/wishlist/get-all-wishlist");
  return response.data;
};

export const gremoveASingleWishlistProduct = async (productId) => {
  const response = await api.post(
    `/api/wishlist/remove-wishlist/${productId}`,
    productId,
  );
  return response.data;
};

export const gremoveAllWishlistProducts = async () => {
  const response = await api.post("/api/wishlist/clear/all");
  return response.data;
};
