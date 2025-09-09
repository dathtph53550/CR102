import { createSlice } from '@reduxjs/toolkit';
import { fetchCartItems, addToCart, updateCartItemQuantity, removeCartItem } from '../../services/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.totalAmount = calculateTotal(action.payload);
    },
    addCartItem: (state, action) => {
      state.items.push(action.payload);
      state.totalAmount = calculateTotal(state.items);
    },
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity;
        state.totalAmount = calculateTotal(state.items);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalAmount = calculateTotal(state.items);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const { 
  setCartItems, 
  addCartItem, 
  updateCartItem, 
  removeFromCart,
  setLoading,
  setError 
} = cartSlice.actions;

export const fetchCart = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const cartItems = await fetchCartItems(userId);
    dispatch(setCartItems(cartItems));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addItemToCart = (productId, quantity, price, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const newItem = await addToCart(productId, quantity, price, userId);
    dispatch(addCartItem(newItem));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateItemQuantity = (itemId, quantity) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await updateCartItemQuantity(itemId, quantity);
    dispatch(updateCartItem({ id: itemId, quantity }));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeItem = (itemId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await removeCartItem(itemId);
    dispatch(removeFromCart(itemId));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default cartSlice.reducer;
