import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/counters/cartSlice";
export default configureStore({
  reducer: {
    cart: cartReducer,
  },
});
