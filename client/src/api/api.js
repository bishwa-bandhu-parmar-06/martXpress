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
export const loginRole = async (formData) =>{
  const response = await axiosInstance.post("/auth/login", formData);
  return response.data;
}