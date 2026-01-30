import api from "../axiosInstance";
import { getAuthToken } from "../../utils/auth.js";

const token = getAuthToken("authToken");


// Function for get All Products of Logged in Seller
export const getAllProductsOfLoggedInSeller = async () => {
  try {
    const response = await api.get("/sellers/products/my-products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};



// Function for Adding the Products 
export const AddProductsForLoggedInSeller = async (productsData) => {
  try {
    const response = await api.post("/sellers/products/add", productsData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
