import api from "../axiosInstance";

// ==========================================
// AUTHENTICATION (Existing)
// ==========================================
export const registerUsers = async (payload) => {
  const res = await api.post("/auth/register-users", payload);
  return res.data;
};

// ==========================================
// USER PROFILE
// ==========================================
export const getUserProfile = async () => {
  const res = await api.get("/users/user-profile");
  return res.data;
};

export const updateUserDetails = async (payload) => {
  const res = await api.post("/users/update-user-details", payload);
  return res.data;
};

// ==========================================
// USER ADDRESS MANAGEMENT
// ==========================================
export const addUserAddress = async (payload) => {
  const res = await api.post("/users/add-user-address", payload);
  return res.data;
};

export const getAllUserAddresses = async () => {
  const res = await api.get("/users/all-user-address");
  return res.data;
};

export const getSingleAddress = async (addressId) => {
  const res = await api.get(`/users/single-address/${addressId}`);
  return res.data;
};

export const updateUserAddress = async (addressId, payload) => {
  const res = await api.post(
    `/users/update-user-address/${addressId}`,
    payload,
  );
  return res.data;
};

export const removeUserAddress = async (addressId) => {
  const res = await api.post(`/users/remove-user-address/${addressId}`);
  return res.data;
};


// ACCOUNT SETTINGS
// ==========================================
export const changeUserPassword = async (payload) => {
  const res = await api.post("/users/change-password", payload);
  return res.data;
};

export const deleteUserAccount = async () => {
  const res = await api.delete("/users/delete-account");
  return res.data;
};