import api from "../axiosInstance";

// ---------------------------------------------
export const addRatings = async () => {
  const response = await api.post("/api/rating/add-rating");
  return response.data;
};
export const getAllRatings = async () => {
  const response = await api.get("/api/rating/product-all-rating/:productId");
  return response.data;
};
export const getAllRatingsofUsers = async () => {
  const response = await api.get("/api/rating/product-rating/:productId");
  return response.data;
};

export const deleteRatingsofUsers = async () => {
  const response = await api.get("/api/rating/delete-rating/:productId");
  return response.data;
};
