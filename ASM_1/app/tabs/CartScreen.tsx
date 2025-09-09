import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fetchCartItems, updateCartItemQuantity, removeCartItem, CartItem, addToCart } from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useTheme } from '../components/ThemeProvider';
import Lottie from 'lottie-react-native';
import emptyCartAnimation from '../../assets/images/emptyCart.json'; // Adjust the path as necessary

interface CartItemWithDetails extends CartItem {
  name: string;
  image: string;
  description?: string;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  // Define loadCartItems with useCallback to prevent recreation on each render
  const loadCartItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Use the current user's ID if available, otherwise default to "1"
      const userId = user?.id ? String(user.id) : "1";
      const items = await fetchCartItems(userId);
      // Add a description field for display purposes
      const itemsWithDescription = items.map(item => ({
        ...item,
        description: `${item.quantity} x $${item.price}`
      }));
      setCartItems(itemsWithDescription);
    } catch (error) {
      console.error('Error loading cart items:', error);
      setError('Failed to load cart items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]); // Only recreate when user ID changes
  
  // Load cart items when the component mounts
  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);
  
  // Also reload cart items when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCartItems();
      return () => {};
    }, [loadCartItems])
  );



  const updateQuantity = useCallback(async (id: string, change: number) => {
    try {
      setIsUpdating(true);
      
      setCartItems(prevItems => {
        const item = prevItems.find(item => item.id === id);
        if (!item) return prevItems;
        
        const newQuantity = Math.max(1, item.quantity + change);
        
        return prevItems.map(item => 
          item.id === id 
            ? { ...item, quantity: newQuantity, description: `${newQuantity} x $${item.price}` } 
            : item
        );
      });
      
      const updatedItem = cartItems.find(item => item.id === id);
      if (updatedItem) {
        await updateCartItemQuantity(id, updatedItem.quantity);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng. Vui lòng thử lại.');
      loadCartItems();
    } finally {
      setIsUpdating(false);
    }
  }, [cartItems, loadCartItems]);

  const removeItem = useCallback(async (id: string) => {
    try {
      setIsUpdating(true);
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      
      await removeCartItem(id);
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại.');
      // Revert the optimistic update by reloading cart items
      loadCartItems();
    } finally {
      setIsUpdating(false);
    }
  }, [loadCartItems]);

  const calculateTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(3);
  }, [cartItems]);

  const renderCartItem = (item: CartItemWithDetails) => (
    <View key={item.id} style={styles.cartItemContainer}>
      <View style={styles.cartItemContent}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.quantity} x {item.price.toFixed(3)} đ</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              onPress={() => updateQuantity(item.id!, -1)} 
              style={styles.quantityButton}
              disabled={isUpdating}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity 
              onPress={() => updateQuantity(item.id!, 1)} 
              style={styles.quantityButton}
              disabled={isUpdating}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.itemPriceContainer}>
          <Text style={[styles.itemPrice, { color: theme.primaryColor }]}>{(item.price * item.quantity).toFixed(3)} đ</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => removeItem(item.id!)} 
        disabled={isUpdating}
        style={styles.removeButton}
      >
        <Feather name="x" size={20} color={isDarkMode ? '#555' : '#CCCCCC'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.screenTitle, { color: theme.textColor }]}>Giỏ Hàng</Text>
      
      {isLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      ) : error ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.backgroundColor }]}>
          <Text style={[styles.errorText, { color: theme.textColor }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primaryColor }]} onPress={loadCartItems}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : cartItems.length === 0 ? (
        // <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundColor }]}>
        //   <Feather name="shopping-cart" size={60} color={isDarkMode ? '#555' : '#CCCCCC'} />
        //   <Text style={[styles.emptyText, { color: theme.textColor }]}>Giỏ hàng của bạn đang trống</Text>
        //   <Text style={[styles.emptySubtext, { color: theme.textColor }]}>Hãy thêm sản phẩm vào giỏ hàng</Text>
        // </View>
        <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundColor }]}>
          <Lottie source={emptyCartAnimation} autoPlay loop style={styles.emptyAnimation} />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>Giỏ hàng của bạn đang trống</Text>
          <Text style={[styles.emptySubtext, { color: theme.textColor }]}>Hãy thêm sản phẩm vào giỏ hàng</Text>
      </View>
      ) : (
        <>
          <View style={[styles.cartListContainer, { backgroundColor: theme.backgroundColor }]}>
            <ScrollView style={styles.cartList}>
              {cartItems.map(renderCartItem)}
            </ScrollView>
          </View>
          
          <View style={[styles.bottomContainer, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: theme.textColor }]}>Tổng tiền:</Text>
              <Text style={[styles.totalAmount, { color: theme.primaryColor }]}>{calculateTotal} đ</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton} 
              disabled={isUpdating}
              onPress={() => navigation.navigate('PaymentScreen' as never, {
                cartItems,
                totalAmount: calculateTotal
              } as never)}
            >
              <Text style={styles.checkoutButtonText}>Thanh toán</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.totalPrice}>{calculateTotal} đ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      {isUpdating && (
        <View style={styles.updatingOverlay}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20, // Added padding to the main container
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  cartListContainer: {
    flex: 1,
    marginBottom: 10, // Added margin to ensure list doesn't touch the bottom container
  },
  cartList: {
    flex: 1,
  },
  cartItemContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  cartItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#181725',
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPriceContainer: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  bottomContainer: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 80, // Increased padding to avoid bottom navigation overlap
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C7C7C',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#181725',
  },
  checkoutButton: {
    backgroundColor: '#53B175',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  totalPrice: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#53B175',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 10,
    textAlign: 'center',
  },
  updatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAnimation: {
    width: 150, // Adjust size as needed
    height: 150,
    marginBottom: 20,
  },
});

export default CartScreen;