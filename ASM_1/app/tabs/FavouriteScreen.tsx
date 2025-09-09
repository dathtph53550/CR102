import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fetchFavoriteProducts } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { Product } from '../types/product';
import { useTheme } from '../components/ThemeProvider';



const FavoritesScreen = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { user } = useUser();
  const { theme, isDarkMode } = useTheme();

  // Load favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavoriteProducts();
    }, [])
  );

  const loadFavoriteProducts = async () => {
    try {
      setLoading(true);
      const products = await fetchFavoriteProducts();
      setFavoriteProducts(products);
    } catch (error) {
      console.error('Error loading favorite products:', error);
      setError('Failed to load favorite products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('DetailScreen' as never, { 
      product, 
      user: user || { id: '1' } 
    } as never);
  };


  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={[styles.itemContainer, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleProductPress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.itemImage} 
        defaultSource={require('../../assets/images/react-logo.png')}
      />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: theme.textColor }]}>{item.name}</Text>
        <Text style={[styles.itemDescription, { color: theme.textColor }]}>{item.description || '1kg, Price'}</Text>
      </View>
      <Text style={[styles.itemPrice, { color: theme.primaryColor }]}>${item.price.toFixed(2)}</Text>
      <Feather name="chevron-right" size={20} color={theme.textColor} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
        <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading favorite products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.backgroundColor }]}>
        <Feather name="alert-circle" size={50} color="#FF4747" />
        <Text style={[styles.errorText, { color: theme.textColor }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primaryColor }]} onPress={loadFavoriteProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.header, { color: theme.textColor }]}>Favourite</Text>
      
      {favoriteProducts.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundColor }]}>
          <Feather name="heart" size={50} color={isDarkMode ? '#555' : '#E0E0E0'} />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>Không có sản phẩm yêu thích</Text>
          <Text style={[styles.emptySubText, { color: theme.textColor }]}>Sản phẩm bạn yêu thích sẽ xuất hiện ở đây</Text>
          <TouchableOpacity 
            style={[styles.browseButton, { backgroundColor: theme.primaryColor }]}
            onPress={() => navigation.navigate('HomeScreen' as never)}
          >
            <Text style={styles.browseButtonText}>Xem sản phẩm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={favoriteProducts}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  listContainer: {
    borderRadius: 10,
    marginHorizontal: 15,
    paddingVertical: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#F0F0F0',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  itemDescription: {
    color: '#7C7C7C',
    marginTop: 3,
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#53B175',
    marginRight: 10,
  },
  addToCartButton: {
    backgroundColor: '#53B175',
    paddingVertical: 18,
    marginHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7C7C7C',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#181725',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#53B175',
    paddingVertical: 12,
    paddingHorizontal: 30,
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
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
  },
  browseButton: {
    marginTop: 25,
    backgroundColor: '#53B175',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default FavoritesScreen;

