import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.role = action.payload.role;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logoutSuccess: (state) => {
      state.role = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
