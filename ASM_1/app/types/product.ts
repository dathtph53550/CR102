export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
  is_hot: boolean;
  is_favourite: boolean;
  viewed_at: string;
  created_at: string;
}

export interface Comment {
  id: string | number;
  product_id: string | number;
  user_id: string | number;
  user_name: string;
  content: string;
  rating: number;
  created_at: string;
}

export interface CartItem {
  id: string | number;
  product_id: string | number;
  user_id: string | number;
  quantity: number;
  price: number;
  created_at: string;
}

export interface CartItemWithDetails extends CartItem {
  product?: Product;
}