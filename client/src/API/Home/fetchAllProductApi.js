import api from "../axiosInstance";

export const fetchAllProductsForHomePage = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
