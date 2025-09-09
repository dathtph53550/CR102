import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "./redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#FF5757',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center'
      }}>
        <Stack.Screen name="index" options={{ title: "Quản lý " }} />
        <Stack.Screen name="add" options={{ title: "Thêm  " }} />
        <Stack.Screen name="edit" options={{ title: "Sửa " }} />
      </Stack>
    </Provider>
  );
}
