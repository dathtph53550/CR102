import { createSlice } from '@reduxjs/toolkit';
import { login, register } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

// Action creators
export const { 
  setUser, 
  setLoading, 
  setError, 
  clearError,
  logout 
} = userSlice.actions;

// Thunk actions
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    const user = await login(email, password);
    dispatch(setUser(user));
    
    // Save user to AsyncStorage for persistence
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerUser = (email, password, fullName) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    const user = await register(email, password, fullName);
    dispatch(setUser(user));
    
    // Save user to AsyncStorage for persistence
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('user');
    dispatch(logout());
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const loadStoredUser = () => async (dispatch) => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      dispatch(setUser(user));
    }
  } catch (error) {
    console.error('Error loading stored user:', error);
  }
};

export default userSlice.reducer;
