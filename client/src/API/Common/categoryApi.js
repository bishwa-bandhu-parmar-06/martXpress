import api from "../axiosInstance";
import { getAuthToken } from "../../utils/auth.js";

const token = getAuthToken("authToken");

// get all categories name
export const getAllCategories = async () => {
  const response = await api.get("/all-categories");
//   console.log("Cheking Respose: ", response);
  return response.data;
};
