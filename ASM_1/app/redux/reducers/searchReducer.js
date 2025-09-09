import { createSlice } from '@reduxjs/toolkit';
import { searchProducts } from '../../services/api';

const initialState = {
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  error: null,
  categories: [
    { id: 1, name: 'Burger', icon: 'hamburger' },
    { id: 2, name: 'Pizza', icon: 'pizza-slice' },
    { id: 3, name: 'Drink', icon: 'coffee' },
    { id: 4, name: 'Sushi', icon: 'fish' },
  ],
  recentSearches: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    addRecentSearch: (state, action) => {
      // Không thêm nếu đã tồn tại
      if (!state.recentSearches.includes(action.payload)) {
        // Giới hạn số lượng tìm kiếm gần đây
        if (state.recentSearches.length >= 5) {
          state.recentSearches.pop();
        }
        state.recentSearches.unshift(action.payload);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

export const { 
  setSearchQuery, 
  setSearchResults, 
  setIsSearching, 
  setError, 
  clearSearch,
  addRecentSearch,
  clearRecentSearches
} = searchSlice.actions;

// Thunk action để tìm kiếm sản phẩm
export const searchProductsByName = (query) => async (dispatch) => {
  try {
    dispatch(setIsSearching(true));
    dispatch(setSearchQuery(query));
    
    if (!query.trim()) {
      dispatch(clearSearch());
      dispatch(setIsSearching(false));
      return;
    }
    
    const results = await searchProducts(query);
    dispatch(setSearchResults(results));
    dispatch(addRecentSearch(query));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIsSearching(false));
  }
};

export default searchSlice.reducer;
