import api from "../axiosInstance";

export const addRatings = async (data) => {
  const response = await api.post("/rating/add-rating", data);
  return response.data;
};

export const getAllRatings = async (productId) => {
  const response = await api.get(`/rating/product-all-rating/${productId}`);
  return response.data;
};

export const getMyRating = async (productId) => {
  const response = await api.get(`/rating/product-rating/${productId}`);
  return response.data;
};
export const getAllMyRatings = async () => {
  const response = await api.get("/rating/my-ratings");
  return response.data;
};
export const deleteRatingsofUsers = async (productId) => {
  const response = await api.post(`/rating/delete-rating/${productId}`);
  return response.data;
};
