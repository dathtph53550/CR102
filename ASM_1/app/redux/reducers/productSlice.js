import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://asm-cro102.onrender.com/products');
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể tải danh sách sản phẩm');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://asm-cro102.onrender.com/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể tải danh sách danh mục');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://asm-cro102.onrender.com/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Không thể xóa sản phẩm');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      // Add default values for other fields
      const newProduct = {
        ...productData,
        is_hot: false,
        is_favourite: false,
        viewed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      const response = await axios.post('https://asm-cro102.onrender.com/products', newProduct);
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể thêm sản phẩm');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://asm-cro102.onrender.com/products/${product.id}`, product);
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể cập nhật sản phẩm');
    }
  }
);

const productSlice = createSlice({
  name: 'adminProducts', // Different name from 'products' in productReducer.js
  initialState: {
    products: [],
    categories: [],
    loading: false,
    error: null,
    selectedProduct: null,
    isModalVisible: false
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      state.isModalVisible = true;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setModalVisible: (state, action) => {
      state.isModalVisible = action.payload;
      if (!action.payload) {
        state.selectedProduct = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add Product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.isModalVisible = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.isModalVisible = false;
        state.selectedProduct = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { 
  setSelectedProduct, 
  clearSelectedProduct, 
  setModalVisible, 
  clearError 
} = productSlice.actions;

export default productSlice.reducer;
