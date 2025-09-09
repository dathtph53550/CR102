import { createAsyncThunk } from "@reduxjs/toolkit";
import { addSinhVien } from "./reducer";

const API = "https://680355330a99cb7408ebade8.mockapi.io/XeMay";

export const fetchSinhVien = createAsyncThunk(
  'sinhvien/fetchSinhVien',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addSinhVienOnAPI = createAsyncThunk(
  'sinhvien/addSinhVienOnAPI',
  async (objSinhVien, thunkAPI) => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objSinhVien)
      });
      const data = await res.json();
      if(res.ok){
        return data;
      }else{
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteSinhVien = createAsyncThunk(
  "car/deleteSinhVien",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateSinhVien = createAsyncThunk(
  "sinhvien/updateSinhVien",
  async (objSinhVien, thunkAPI) => {
    try {
      const response = await fetch(`${API}/${objSinhVien.id}`, {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objSinhVien)
      });
      const data = await response.json();
      if(response.ok){
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);