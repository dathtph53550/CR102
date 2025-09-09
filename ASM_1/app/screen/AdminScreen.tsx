import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// Import Admin Screens
import ProductManagement from '../admin/ProductManagement';
import CategoryManagement from '../admin/CategoryManagement';
import OrderManagement from '../admin/OrderManagement';

// Create Drawer Navigator
const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props: any) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // TODO: Xử lý logic đăng xuất tại đây (xóa token nếu có, vv...)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#FF6347" />
        <Text style={styles.logoutText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminScreen = () => {
  return (
    <View style={styles.container}>
      
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="ProductManagement"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6347',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#FF6347',
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: {
            marginLeft: 0,
            fontSize: 16,
          },
        }}
      >
        <Drawer.Screen
          name="ProductManagement"
          component={ProductManagement}
          options={{
            title: 'Quản Lý Sản Phẩm',
            drawerIcon: ({ color }) => (
              <Feather name="shopping-bag" size={20} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="CategoryManagement"
          component={CategoryManagement}
          options={{
            title: 'Quản Lý Danh Mục',
            drawerIcon: ({ color }) => (
              <Feather name="list" size={20} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="OrderManagement"
          component={OrderManagement}
          options={{
            title: 'Quản Lý Đặt Hàng',
            drawerIcon: ({ color }) => (
              <Feather name="package" size={20} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {

    flexDirection: 'row',
    alignItems: 'center',
    padding: 30,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FF6347',
    fontWeight: 'bold',
  },

});

export default AdminScreen;
