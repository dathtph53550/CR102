import { Product, Comment, CartItemWithDetails } from '../types/product';
import { UserType } from '../types/navigation';



// Define Notification interface
export interface Notification {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

const API_URL = 'https://asm-cro102.onrender.com';

export async function changePassword(userId: string | number, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to change password');
    }
    
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}



export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // Lấy tất cả sản phẩm trước
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const allProducts = await response.json();
    
    // Lọc sản phẩm theo tên một cách chính xác hơn
    const searchTerm = query.toLowerCase().trim();
    const filteredProducts = allProducts.filter((product: Product) => 
      product.name.toLowerCase().includes(searchTerm)
    );
    
    return filteredProducts;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

export async function fetchProductsByCategory(categoryId: string | number): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products?category_id=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

export async function fetchComments(productId: number | string): Promise<Comment[]> {
  try {
    // Fetch comments for the product
    const response = await fetch(`${API_URL}/comments?product_id=${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const comments = await response.json();
    
    // Fetch all users to match with comments
    const usersResponse = await fetch(`${API_URL}/users`);
    if (!usersResponse.ok) {
      throw new Error('Failed to fetch users');
    }
    const users = await usersResponse.json();
    
    // Add user information to each comment
    const commentsWithUserInfo = comments.map((comment: Comment) => {
      const user = users.find((u: any) => u.id === comment.user_id);
      return {
        ...comment,
        user: user ? { full_name: user.full_name } : undefined
      };
    });
    
    return commentsWithUserInfo;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return []; // Return empty array to prevent app crashes
  }
}

export async function addComment(productId: number | string, comment: string, userId: number | string, rating: number = 5): Promise<Comment> {
  try {
    // Get the current date in ISO format
    const currentDate = new Date().toISOString();
    
    const commentResponse = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: String(productId),
        user_id: String(userId),
        comment,
        rating,
        created_at: currentDate
      }),
    });

    if (!commentResponse.ok) {
      throw new Error('Failed to add comment');
    }

    return await commentResponse.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<UserType> {
  try {
    const response = await fetch(`${API_URL}/users?email=${email}`);
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    const users = await response.json();
    const user = users[0];

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function register(email: string, password: string, fullName: string): Promise<UserType> {
  try {
    const checkResponse = await fetch(`${API_URL}/users?email=${email}`);
    if (!checkResponse.ok) {
      throw new Error('Failed to check existing user');
    }
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      throw new Error('Email already exists');
    }

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to register');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}

export interface Banner {
  id: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem {
  id?: string;
  user_id?: string;
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch notifications for a specific user
export const fetchNotifications = async (userId = "1"): Promise<Notification[]> => {
  try {
    const response = await fetch(`${API_URL}/notification?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return []; // Return empty array on error to prevent app crashes
  }
};

export const fetchBanners = async (): Promise<Banner[]> => {
  try {
    const response = await fetch(`${API_URL}/banner`);
    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const fetchHotProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products?is_hot=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch hot products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hot products:', error);
    throw error;
  }
};

export const fetchFavoriteProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products?is_favourite=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch favorite products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    return []; // Return empty array on error to prevent app crashes
  }
};

export const toggleFavoriteStatus = async (productId: string | number, isFavorite: boolean): Promise<boolean> => {
  try {
    // First get the current product data
    const productResponse = await fetch(`${API_URL}/products/${productId}`);
    if (!productResponse.ok) {
      throw new Error('Failed to fetch product');
    }
    const product = await productResponse.json();
    
    // Update the favorite status
    const updatedProduct = {
      ...product,
      is_favourite: isFavorite
    };
    
    // Save the updated product
    const updateResponse = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update favorite status');
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    return false;
  }
};

// Cart functions
export const fetchCartItems = async (userId = "1"): Promise<CartItemWithDetails[]> => {
  try {
    // First get the cart items for the specific user
    const response = await fetch(`${API_URL}/cart?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }
    
    const cartItems = await response.json();
    
    // For each cart item, get the product details
    const cartItemsWithDetails = await Promise.all(
      cartItems.map(async (item: CartItem) => {
        const productResponse = await fetch(`${API_URL}/products/${item.product_id}`);
        if (!productResponse.ok) {
          throw new Error(`Failed to fetch product with id ${item.product_id}`);
        }
        
        const product = await productResponse.json();
        
        return {
          ...item,
          name: product.name,
          image: product.image,
          productId: item.product_id // Add productId field for compatibility
        };
      })
    );
    
    return cartItemsWithDetails;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const addToCart = async (productId: string, quantity: number, price: number, userId = "1"): Promise<CartItem> => {
  try {
    // Check if the product already exists in the cart for this user
    const cartResponse = await fetch(`${API_URL}/cart?product_id=${productId}&user_id=${userId}`);
    if (!cartResponse.ok) {
      throw new Error('Failed to check cart');
    }
    
    const existingCartItems = await cartResponse.json();
    
    if (existingCartItems.length > 0) {
      // Update existing cart item
      const existingItem = existingCartItems[0];
      const newQuantity = existingItem.quantity + quantity;
      
      const updateResponse = await fetch(`${API_URL}/cart/${existingItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity
        }),
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update cart item');
      }
      
      return await updateResponse.json();
    } else {
      // Add new cart item
      const newCartItem = {
        user_id: userId, // Use user_id instead of order_id
        product_id: productId,
        quantity: quantity,
        price: price
      };
      
      const addResponse = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCartItem),
      });
      
      if (!addResponse.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      return await addResponse.json();
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem> => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: quantity
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update cart item quantity');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

export const removeCartItem = async (cartItemId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove cart item');
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const fetchHistoryProducts = async (userId = "1"): Promise<Product[]> => {
  try {
    // Fetch all products
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch history products');
    }
    
    const data = await response.json();
    
    // Filter products that have been viewed (have a viewed_at timestamp)
    const viewedProducts = data.filter((product: Product) => 
      product.viewed_at && product.viewed_at !== ''
    );
    
    // Sort products by viewed_at timestamp in descending order (most recent first)
    viewedProducts.sort((a: Product, b: Product) => {
      const dateA = new Date(a.viewed_at || 0).getTime();
      const dateB = new Date(b.viewed_at || 0).getTime();
      return dateB - dateA; // Descending order
    });
    
    return viewedProducts;
  } catch (error) {
    console.error('Error fetching history products:', error);
    throw error;
  }
}; 

export const updateViewedProduct = async (productId: number | string): Promise<string> => {
  try {
    // Get all products first
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Không thể lấy danh sách sản phẩm: ${response.status} ${response.statusText}`);
    }
    
    const products = await response.json();
    
    // Find the product with the matching ID
    // Convert both IDs to strings for comparison to handle both number and string IDs
    const product = products.find((p: any) => String(p.id) === String(productId));
    
    if (!product) {
      throw new Error(`Không tìm thấy sản phẩm với ID: ${productId}`);
    }
    
    const newViewedAt = new Date().toISOString();
    
    // Update the product with the new viewed_at timestamp
    const updateResponse = await fetch(`${API_URL}/products/${product.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewed_at: newViewedAt }),
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Không thể cập nhật sản phẩm: ${updateResponse.status} ${updateResponse.statusText} - ${errorText}`);
    }
    
    return newViewedAt;
  } catch (error) {
    console.error("Lỗi khi cập nhật viewed_at:", error);
    throw error;
  }
};

export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  try {
    const response = await fetch(`${API_URL}/cart?user_id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// This function was removed to fix the duplicate declaration error

export const removeFromCart = async (cartId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to remove item from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
}

export const placeOrder = async (userId: number, totalPrice: number): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, total_price: totalPrice, status: 'Pending', created_at: new Date().toISOString() }),
    });

    if (!response.ok) throw new Error('Failed to place order');
    return await response.json();
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

