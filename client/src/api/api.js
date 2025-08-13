import axiosInstance from "./axios";

// functions for registering users profile
export const registerUsers = async (formData) => {
  const response = await axiosInstance.post("/auth/register-users", formData);
  return response.data;
};

// functions for register admin
export const registerAdmin = async (formData) => {
  const response = await axiosInstance.post("/auth/register-admin", formData);
  return response.data;
};

// functions for register admin
export const registerSellers = async (formDataObj) => {
  const formData = new FormData();

  formData.append("name", formDataObj.name);
  formData.append("email", formDataObj.email);
  formData.append("password", formDataObj.password);
  formData.append("confirmPassword", formDataObj.confirmPassword);
  formData.append("gst[gst_Number]", formDataObj.gst_Number);
  if (formDataObj.gst_Certificate) {
    formData.append("gst_Certificate", formDataObj.gst_Certificate);
  }

  const response = await axiosInstance.post("/auth/register-sellers", formData);
  return response.data;
};

// functions for all role login or All in one Login
export const loginRole = async (formData) => {
  const response = await axiosInstance.post("/auth/login", formData, {
    withCredentials: true,
  });
  return response.data;
};

// logout user function
export const logoutUser = async () => {
  const response = await axiosInstance.post(
    "/auth/logout",
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const createProduct = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/sellers/create-product",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error.response?.data || error);
    throw error;
  }
};
