import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchXeMay, addXeMay, updateXeMay, deleteXeMay } from '../api/xeMayApi';

export const fetchXeMayAsync = createAsyncThunk(
  'xeMay/fetchXeMay',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchXeMay();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addXeMayAsync = createAsyncThunk(
  'xeMay/addXeMay',
  async (xeMay, { rejectWithValue }) => {
    try {
      return await addXeMay(xeMay);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateXeMayAsync = createAsyncThunk(
  'xeMay/updateXeMay',
  async ({ id, xeMay }, { rejectWithValue }) => {
    try {
      console.log('updateXeMayAsync - ID:', id, 'Data:', xeMay);
      // Đảm bảo id là string
      const idString = String(id);
      return await updateXeMay(idString, xeMay);
    } catch (error) {
      console.error('Error in updateXeMayAsync:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteXeMayAsync = createAsyncThunk(
  'xeMay/deleteXeMay',
  async (id, { rejectWithValue }) => {
    try {
      // Đảm bảo id là string
      const idString = String(id);
      await deleteXeMay(idString);
      return idString;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  xeMays: [],
  status: 'idle',
  error: null,
};

const xeMaySlice = createSlice({
  name: 'xeMay',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchXeMayAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchXeMayAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.xeMays = action.payload;
      })
      .addCase(fetchXeMayAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addXeMayAsync.fulfilled, (state, action) => {
        state.xeMays.push(action.payload);
      })
      .addCase(updateXeMayAsync.fulfilled, (state, action) => {
        const index = state.xeMays.findIndex(xeMay => String(xeMay.id) === String(action.payload.id));
        if (index !== -1) {
          state.xeMays[index] = action.payload;
        }
      })
      .addCase(deleteXeMayAsync.fulfilled, (state, action) => {
        state.xeMays = state.xeMays.filter(xeMay => String(xeMay.id) !== String(action.payload));
      });
  },
});

export default xeMaySlice.reducer; 