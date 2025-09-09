import { configureStore } from '@reduxjs/toolkit';
import chiTieuReducer from '../reducers/reducer';

export const store = configureStore({
  reducer: {
    chiTieu: chiTieuReducer
  }
});

export default store;
