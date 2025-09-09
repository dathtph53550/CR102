import { createSlice } from '@reduxjs/toolkit';
import { fetchNotifications } from '../../services/api';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      const sortedNotifications = [...action.payload].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      state.notifications = sortedNotifications;
      state.unreadCount = action.payload.length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
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
  setNotifications, 
  addNotification, 
  markAsRead, 
  markAllAsRead,
  setLoading,
  setError 
} = notificationSlice.actions;

export const loadNotifications = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const notifications = await fetchNotifications(userId);
    dispatch(setNotifications(notifications));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default notificationSlice.reducer;
