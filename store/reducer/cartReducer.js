import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  products: [],
};

export const cartReducer = createSlice({
  name: "cartStore",
  initialState,
  reducers: {
    addIntoCart: (state, action) => {
      const payload = action.payload;
      const existingProducts = state.products.findIndex(
        (product) =>
          product.productId === payload.productId &&
          product.variantId === payload.variantId,
      );
      if (existingProducts < 0) {
        state.products.push(payload);
        state.count = state.products.length;
      }
    },
    increaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const existingProducts = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId,
      );
      if (existingProducts >= 0) {
        state.products[existingProducts].qty += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const existingProducts = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId,
      );
      if (existingProducts >= 0) {
        if (state.products[existingProducts].qty > 1) {
          state.products[existingProducts].qty -= 1;
        }
      }
    },
    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.products = state.products.filter(
        (product) =>
         !(product.productId === productId && product.variantId === variantId),
      );
      state.count = state.products.length;
    },
    cleareCart: (state, action) => {
      state.products = [];
      state.count = 0;
    },
  },
});
export const {
  addIntoCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  cleareCart, 
} = cartReducer.actions;
export default cartReducer.reducer;
