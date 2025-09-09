import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/product';
import { Feather } from '@expo/vector-icons';
import { fetchProducts, fetchHotProducts, fetchHistoryProducts, addToCart, updateViewedProduct } from '../services/api';
import { useUser } from '../context/UserContext';

type AllProductsScreenProps = NativeStackScreenProps<RootStackParamList, 'AllProductsScreen'>;
const { width } = Dimensions.get('window');

export default function AllProductsScreen({ route, navigation }: AllProductsScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const { user } = useUser();
  
  const { type, title } = route.params;

  useEffect(() => {
    loadProducts();
  }, [type]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      let data: Product[] = [];
      
      switch (type) {
        case 'all':
          data = await fetchProducts();
          break;
        case 'hot':
          data = await fetchHotProducts();
          break;
        case 'history':
          const userId = user?.id ? String(user.id) : "1";
          data = await fetchHistoryProducts(userId);
          break;
        default:
          data = await fetchProducts();
      }
      
      // Filter out any products without an id to prevent toString errors
      setProducts(data.filter(product => product && product.id !== undefined));
    } catch (error) {
      console.error(`Error loading ${type} products:`, error);
      Alert.alert('Lỗi', `Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductPress = async (product: Product) => {
    try {
      await updateViewedProduct(String(product.id));
      navigation.navigate('DetailScreen', { 
        product,
        user: {
          id: user?.id || 1,
          full_name: user?.full_name || '',
          email: user?.email || ''
        }
      });
    } catch (error) {
      console.error("Error updating viewed_at:", error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCartId(String(product.id));
      const userId = user?.id ? String(user.id) : "1";
      await addToCart(String(product.id), 1, product.price, userId);
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    } finally {
      setAddingToCartId(null);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    // Safety check to prevent errors with undefined items
    if (!item || item.id === undefined) {
      return null;
    }
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
      >
        {item.is_hot && <View style={styles.hotLabel}><Text style={styles.hotLabelText}>HOT</Text></View>}
        <View style={styles.productImageContainer}>
          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
            style={styles.productImage} 
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name || 'Product'}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{item.description || 'No description available'}</Text>
        </View>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>${(item.price || 0).toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
            disabled={addingToCartId === String(item.id)}
          >
            {addingToCartId === String(item.id) ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="plus" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const formatViewedTime = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'All Products'}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#53B175" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: (width - 36) / 2,
  },
  productImageContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#7C7C7C',
    marginBottom: 5,
    height: 32,
    lineHeight: 16,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
  addButton: {
    backgroundColor: '#53B175',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  hotLabel: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
  },
  hotLabelText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});
