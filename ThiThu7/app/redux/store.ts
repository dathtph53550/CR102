import { configureStore } from '@reduxjs/toolkit';
import sachReducer from './slices/sachSlice';

export const store = configureStore({
  reducer: {
    sach: sachReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 