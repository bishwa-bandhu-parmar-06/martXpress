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
      state.usersData = action.payload.usersData;
    },
    logoutSuccess: (state) => {
      state.role = null;
      state.isLoggedIn = false;
      state.usersData = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
