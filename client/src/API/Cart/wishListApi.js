import api from "../axiosInstance.js";

// ADD item (POST)
export const addProductToWishList = async (productId) => {
  const response = await api.post("/wishlist/add-to-wishlist", { productId });
  return response.data;
};

// GET all items (POST)
export const getAllWishlistProducts = async () => {
  const response = await api.get("/wishlist/get-all-wishlist");
  return response.data;
};

// REMOVE single item (POST)
export const removeASingleWishlistProduct = async (productId) => {
  const response = await api.post(`/wishlist/remove/${productId}`);
  return response.data;
};

// CLEAR all items (POST)
export const removeAllWishlistProducts = async () => {
  const response = await api.post("/wishlist/clear/all");
  return response.data;
};
