import { createSlice } from "@reduxjs/toolkit";

// Step 1: Initial state define karo
const initialState = {
  products: [],
  loading: false,
  error: null
};

// Step 2: Slice banao
const productSlice = createSlice({
  name: "product", // slice ka naam
  initialState,
  reducers: {
    addProductStart: (state) => {
      state.loading = true;
    },
    addProductSuccess: (state, action) => {
      state.loading = false;
      state.products.push(action.payload); // naye product ko list me add
    },
    addProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Step 3: Actions export karo
export const { addProductStart, addProductSuccess, addProductFailure } = productSlice.actions;

// Step 4: Reducer export karo
export default productSlice.reducer;
