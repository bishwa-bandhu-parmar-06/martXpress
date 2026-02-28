import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: [],
  wishlistCount: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload.map(item => item.productId._id || item.productId);
      state.wishlistCount = action.payload.length;
    },
    addToWishlistRedux: (state, action) => {
      if (!state.wishlistItems.includes(action.payload)) {
        state.wishlistItems.push(action.payload);
        state.wishlistCount += 1;
      }
    },
    removeFromWishlistRedux: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(id => id !== action.payload);
      state.wishlistCount = Math.max(0, state.wishlistCount - 1);
    }
  },
});

export const { setWishlist, addToWishlistRedux, removeFromWishlistRedux } = wishlistSlice.actions;
export default wishlistSlice.reducer;