import api from "../axiosInstance";

export const registerSeller = async (sellerData) => {
  try {
    if (sellerData instanceof FormData) {
      const response = await api.post("/auth/register-seller", sellerData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      const response = await api.post("/auth/register-seller", sellerData);
      return response.data;
    }
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};





