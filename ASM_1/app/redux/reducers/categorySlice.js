import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://asm-cro102.onrender.com/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể tải danh sách danh mục');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://asm-cro102.onrender.com/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Không thể xóa danh mục');
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://asm-cro102.onrender.com/categories', categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể thêm danh mục');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://asm-cro102.onrender.com/categories/${category.id}`, category);
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể cập nhật danh mục');
    }
  }
);

const categorySlice = createSlice({
  name: 'adminCategories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    selectedCategory: null,
    isModalVisible: false
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.isModalVisible = true;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    setModalVisible: (state, action) => {
      state.isModalVisible = action.payload;
      if (!action.payload) {
        state.selectedCategory = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(category => category.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.isModalVisible = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.isModalVisible = false;
        state.selectedCategory = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { 
  setSelectedCategory, 
  clearSelectedCategory, 
  setModalVisible, 
  clearError 
} = categorySlice.actions;

export default categorySlice.reducer;
