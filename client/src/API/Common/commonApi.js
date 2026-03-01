import api from "../axiosInstance";

export const login = async (payload) => {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout", {});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Logout Failed");
  }
};

export const googleLogin = async (credential) => {
  const response = await api.post("/auth/google", { token: credential });
  return response.data;
};

export const verifyOtp = async (payload) => {
  try {
    const response = await api.post("/auth/verify-otp", payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const ResendOtp = async (sellerData) => {
  try {
    const response = await api.post("/auth/resend-otp", sellerData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
