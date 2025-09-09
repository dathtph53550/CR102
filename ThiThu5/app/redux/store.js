import { configureStore } from "@reduxjs/toolkit";
import sinhvienReducer from "./reducer";

export const store = configureStore({
  reducer: {
    listSinhVienInStore: sinhvienReducer
  },
});