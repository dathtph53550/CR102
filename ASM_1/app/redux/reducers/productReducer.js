import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchHotProducts, fetchCategories, fetchBanners } from '../../services/api';

const initialState = {
  allProducts: [],
  hotProducts: [],
  categories: [],
  banners: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    setHotProducts: (state, action) => {
      state.hotProducts = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setBanners: (state, action) => {
      state.banners = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setAllProducts, 
  setHotProducts, 
  setCategories, 
  setBanners,
  setSelectedProduct,
  setLoading,
  setError 
} = productSlice.actions;

export const loadAllProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const products = await fetchProducts();
    dispatch(setAllProducts(products));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loadHotProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const hotProducts = await fetchHotProducts();
    dispatch(setHotProducts(hotProducts));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loadCategories = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const categories = await fetchCategories();
    dispatch(setCategories(categories));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loadBanners = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const banners = await fetchBanners();
    dispatch(setBanners(banners));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default productSlice.reducer;
