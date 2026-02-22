import api from "../axiosInstance";
// ---------------------------------------------
// SELLER API FUNCTIONS
// ---------------------------------------------
export const registerSeller = async (sellerData) => {
  const response = await api.post("/auth/register-seller", sellerData);
  return response.data;
};

export const getSellersDetails = async () => {
  // No headers needed! Axios sends the cookie automatically.
  const response = await api.get("/sellers/seller-profile");
  return response.data;
};
