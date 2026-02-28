import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartQuantity: (state, action) => {
      state.cartQuantity = action.payload;
    },
    incrementCartQuantity: (state, action) => {
      state.cartQuantity += action.payload || 1;
    },
    clearCartQuantity: (state) => {
      state.cartQuantity = 0;
    },
  },
});

export const { setCartQuantity, incrementCartQuantity, clearCartQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
