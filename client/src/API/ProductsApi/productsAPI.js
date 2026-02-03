import api from "../axiosInstance";
import { getAuthToken } from "../../utils/auth.js";

const token = getAuthToken("authToken");

// ? Function  get All Products of Logged in Seller
// export const getAllProductsOfLoggedInSeller = async () => {
//   try {
//     const response = await api.get("/sellers/products/my-products", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("Response Product : ", response);
//     return response.data;
//   } catch (error) {
//     throw error.response ? error.response.data : new Error("Network Error");
//   }
// };

// productsAPI.js
export const getAllProductsOfLoggedInSeller = async (page = 1, limit = 10) => {
  try {
    // Pass page and limit as query parameters
    const response = await api.get(
      `/sellers/products/my-products?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // console.log("Response Product : ", response);
    // Based on your JSON log, the data is inside response.data
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// TODO Function for Adding the Products
export const AddProductsForLoggedInSeller = async (formData) => {
  const response = await api.post("/sellers/products/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// TODO Function for Deleting the Products
export const deleteProductsForLoggedInSeller = async (productId) => {
  try {
    const response = await api.post(
      `/sellers/products/delete/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Response for Delete Product :", response);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ? Get All Products For All Users or Public
export const getAllTypeProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ? Get single products details
export const getSingleProductDetails = async (productId) => {
  try {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
