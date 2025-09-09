import React, { useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "expo-router";

export default function Index() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Xin chào!</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Bạn đã đăng nhập thành công bằng Firebase</Text>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  emailText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
