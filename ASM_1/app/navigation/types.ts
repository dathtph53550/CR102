import { Product } from '../types/product';

export type UserType = {
  id: number;
  full_name: string;
  email: string;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  HomeScreen: { user?: UserType };
  DetailScreen: { 
    product: Product; 
    user: UserType;
  };
  ExploreScreen: undefined;
  CartScreen: undefined;
  FavouriteScreen: undefined;
  AccountScreen: undefined;
  MyDetailScreen: undefined;
  AboutScreen: undefined;
}; 