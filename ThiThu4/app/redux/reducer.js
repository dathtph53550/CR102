import { createSlice } from "@reduxjs/toolkit";
import { addCarOnAPI, deleteCar, fetchCar , updateCar } from "./action";

const initialState = {
  listCar: [],
};

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    addCar: (state, action) => {
      state.listCar.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCar.fulfilled, (state, action) => {
      state.listCar = action.payload;
    }).addCase(fetchCar.rejected, (state, action) => {
      state.listCar = [];
    });

    builder.addCase(addCarOnAPI.fulfilled, (state, action) => {
      state.listCar.push(action.payload);
    }).addCase(addCarOnAPI.rejected, (state, action) => {
      state.listCar = [];
    });

    builder.addCase(deleteCar.fulfilled, (state, action) => {
      state.listCar = state.listCar.filter(car => car.id !== action.payload.id);
    }).addCase(deleteCar.rejected, (state, action) => {
      state.listCar = [];
    });

    builder.addCase(updateCar.fulfilled, (state, action) => {
      state.listCar = state.listCar.map(car => car.id === action.payload.id ? action.payload : car);
    }).addCase(updateCar.rejected, (state, action) => {
      state.listCar = [];
    });
  },
});

export const { addCar } = carSlice.actions;
export default carSlice.reducer;