import api from "../axiosInstance";
import { getAuthToken } from "../../utils/auth.js";

// get all categories name
export const getAllBrands = async () => {
  const response = await api.get("/all-brands");
//   console.log("Cheking Respose: ", response);
  return response.data;
};

// get products by brand
export const getProductsByBrand = async (brand, page = 1, limit = 12) => {
  const response = await api.get(
    `/products/brand/${brand}?page=${page}&limit=${limit}`,
  );
//   console.log(" Brands Product : ", response);
  return response.data;
};
