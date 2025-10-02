import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    userInfo: null,
    isLogin: false,
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    storeItem: (state, action) => {
      state.items = action.payload;
    },
    storeUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    totalQuantity: (state) => {
      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    addQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    minusQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    totalAmount: (state) => {
      state.totalAmount = state.items.reduce(
        (total, item) =>
          total +
          (item.price - (item.price * item.discount) / 100) * item.quantity,
        0
      );
    },
  },
});
export const {
  storeItem,
  totalQuantity,
  totalAmount,
  addQuantity,
  minusQuantity,
  removeItem,
  setLogin,
  storeUserInfo,
} = cartSlice.actions;
export default cartSlice.reducer;
