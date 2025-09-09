import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './index';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import HomeScreen from './tabs/HomeScreen';
import ExploreScreen from './tabs/ExploreScreen';
import CartScreen from './tabs/CartScreen';
import FavouriteScreen from './tabs/FavouriteScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from './tabs/AccountScreen';
import DetailScreen from './screen/DetailScreen';
import WelcomeScreen from './screen/WelcomeScreen';
import { Image, Text, View, StyleSheet, Platform } from 'react-native';
import MyDetailsScreen from './screen/MyDetailsScreen'
import AboutScreen from './screen/AboutScreen'
import AllProductsScreen from './screen/AllProductsScreen';
import NotificationScreen from './screen/NotificationScreen';
import PaymentScreen from './screen/PaymentScreen';
import SuccessScreen from './screen/SuccessScreen';
import OrderHistoryScreen from './screen/OrderHistoryScreen';
import ChangePasswordScreen from './screen/ChangePasswordScreen';
import SearchScreen from './screen/SearchScreen';
import CategoryProductsScreen from './screen/CategoryProductsScreen';
import { Feather } from '@expo/vector-icons';
import { UserProvider } from './context/UserContext';
import AdminScreen from './screen/AdminScreen';


// Redux imports
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ThemeProvider from './components/ThemeProvider';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 35,
          marginLeft: 15,
          marginRight: 15,
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#53B175',
        tabBarInactiveTintColor: '#181725',
      }}
    >
      <Tab.Screen
        name="Shop"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <Feather name="home" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabText, { color }]}>Shop</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <Feather name="search" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabText, { color }]}>Explore</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <Feather name="shopping-cart" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabText, { color }]}>Cart</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <Feather name="heart" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabText, { color }]}>Favourite</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <Feather name="user" size={22} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabText, { color }]}>Account</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootLayout() {

  console.log("HomeScreen:", HomeScreen);
console.log("SearchScreen:", SearchScreen);
console.log("CartScreen:", CartScreen);
console.log("FavouriteScreen:", FavouriteScreen);
console.log("AccountScreen:", AccountScreen);
console.log("DetailScreen:", DetailScreen);
console.log("AllProductsScreen:", AllProductsScreen);
console.log("NotificationScreen:", NotificationScreen);
console.log("MyDetailsScreen:", MyDetailsScreen);
console.log("AboutScreen:", AboutScreen);
console.log("PaymentScreen:", PaymentScreen);
console.log("SuccessScreen:", SuccessScreen);
console.log("OrderHistoryScreen:", OrderHistoryScreen);
console.log("ChangePasswordScreen:", ChangePasswordScreen);
console.log("SearchScreen:", SearchScreen);
console.log("CategoryProductsScreen:", CategoryProductsScreen);


  return (
    <Provider store={store}>
      <UserProvider>
        <ThemeProvider>
          <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{headerShown: false}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="HomeScreen" component={TabNavigator}/>
            <Stack.Screen name="DetailScreen" component={DetailScreen}/>
            <Stack.Screen name="AllProductsScreen" component={AllProductsScreen}/>
            <Stack.Screen name="NotificationScreen" component={NotificationScreen}/>
            <Stack.Screen name="MyDetailScreen" component={MyDetailsScreen}/>
            <Stack.Screen name="AboutScreen" component={AboutScreen}/>
            <Stack.Screen name="PaymentScreen" component={PaymentScreen}/>
            <Stack.Screen name="SuccessScreen" component={SuccessScreen}/>
            <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen}/>
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen}/>
            <Stack.Screen name="SearchScreen" component={SearchScreen}/>
            <Stack.Screen name="CategoryProductsScreen" component={CategoryProductsScreen}/>
            <Stack.Screen name="AdminScreen" component={AdminScreen}/>
          </Stack.Navigator>
        </ThemeProvider>
      </UserProvider>
    </Provider>
  );  
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
  },
});
