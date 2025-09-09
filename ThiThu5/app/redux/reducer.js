import { createSlice } from "@reduxjs/toolkit";
import { addSinhVienOnAPI, deleteSinhVien, fetchSinhVien, updateSinhVien } from "./action";

const initialState = {
  listSinhVien: [],
};

const sinhvienSlice = createSlice({
  name: "sinhvien",
  initialState,
  reducers: {
    addSinhVien: (state, action) => {
      state.listSinhVien.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSinhVien.fulfilled, (state, action) => {
      state.listSinhVien = action.payload;
    }).addCase(fetchSinhVien.rejected, (state, action) => {
      state.listSinhVien = [];
    });

    builder.addCase(addSinhVienOnAPI.fulfilled, (state, action) => {
      state.listSinhVien.push(action.payload);
    }).addCase(addSinhVienOnAPI.rejected, (state, action) => {
      state.listSinhVien = [];
    });

    builder.addCase(deleteSinhVien.fulfilled, (state, action) => {
      state.listSinhVien = state.listSinhVien.filter(SV => SV.id !== action.payload.id);
    }).addCase(deleteSinhVien.rejected, (state, action) => {
      state.listSinhVien = [];
    });

    builder.addCase(updateSinhVien.fulfilled, (state, action) => {
      state.listSinhVien = state.listSinhVien.map(SV => SV.id === action.payload.id ? action.payload : SV);
    }).addCase(updateSinhVien.rejected, (state, action) => {
      state.listSinhVien = [];
    });
  },
});

export const { addSinhVien } = sinhvienSlice.actions;
export default sinhvienSlice.reducer;