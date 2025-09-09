import React from 'react';
import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import store from './redux/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ 
            title: "Quản lý Xe Máy",
            headerStyle: {
              backgroundColor: '#FF5722',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="add"
          options={{ 
            title: "Thêm Xe Máy",
            headerStyle: {
              backgroundColor: '#FF5722',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="edit"
          options={{ 
            title: "Sửa Xe Máy",
            headerStyle: {
              backgroundColor: '#FF5722',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack>
    </Provider>
  );
}
