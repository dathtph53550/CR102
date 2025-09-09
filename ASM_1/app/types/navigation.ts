import { Product } from './product';

export interface UserType {
  id: number;
  full_name: string;
  email: string;
  password?: string;
}

export type RootStackParamList = {
  SplashScreen: undefined;
  WelcomeScreen: undefined;
  Login: undefined;
  Register: undefined;
  HomeScreen: { user: UserType } | undefined;
  DetailScreen: { product: Product; user: UserType };
  AllProductsScreen: { type: string; title: string };
  NotificationScreen: undefined;
  Cart: undefined;
  Explore: undefined;
  Favourite: undefined;
  Account: undefined;
  MyDetailScreen: undefined;
  AboutScreen: undefined;
  ChangePasswordScreen: undefined;
  OrderHistoryScreen: undefined;
  SearchScreen: undefined;
  CategoryProductsScreen: { categoryId: string | number; categoryName: string };
}; 