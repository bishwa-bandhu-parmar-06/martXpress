// Helper functions to manage authentication state
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

export const setUserRole = (role) => {
  localStorage.setItem("userRole", role);
};

export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

export const removeUserRole = () => {
  localStorage.removeItem("userRole");
};

export const setUserEmail = (email) => {
  localStorage.setItem("userEmail", email);
};

export const getUserEmail = () => {
  return localStorage.getItem("userEmail");
};

export const removeUserEmail = () => {
  localStorage.removeItem("userEmail");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Clear all auth data
export const clearAuthData = () => {
  removeAuthToken();
  removeUserRole();
  removeUserEmail();
  localStorage.removeItem("justRegistered");
};

// Set all user data after successful login/registration
export const setUserData = (token, role, email) => {
  setAuthToken(token);
  setUserRole(role);
  setUserEmail(email);
};
