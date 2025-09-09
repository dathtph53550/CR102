import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../FirebaseConfig";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ 
          title: "Đăng Nhập",
          headerShown: false
        }} />
        <Stack.Screen name="register" options={{ 
          title: "Đăng Ký",
          headerShown: false
        }} />
      </Stack>
    </AuthProvider>
  );
}
