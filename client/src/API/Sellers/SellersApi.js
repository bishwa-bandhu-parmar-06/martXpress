import api from "../axiosInstance";
import { getAuthToken } from "../../utils/auth.js";

const token = getAuthToken("authToken");
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

// TODO: Get Sellers Profile Details
export const getSellersDetails = async () => {
  try {
    const response = await api.get("/sellers/seller-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Response Sellers details:", response);
    return response.data;
  } catch (error) {
    console.error("Get sellers error:", error);
    throw error?.response?.data || new Error("Network Error");
  }
};
