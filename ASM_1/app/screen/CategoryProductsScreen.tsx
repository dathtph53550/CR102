import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeProvider';
import { useUser } from '../context/UserContext';
import { fetchProductsByCategory } from '../services/api';

type CategoryProductsScreenRouteProp = RouteProp<RootStackParamList, 'CategoryProductsScreen'>;

const CategoryProductsScreen = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CategoryProductsScreenRouteProp>();
  const { user } = useUser();
  
  const { categoryId, categoryName } = route.params;

  useEffect(() => {
    loadProductsByCategory();
  }, [categoryId]);

  const loadProductsByCategory = async () => {
    setLoading(true);
    try {
      const results = await fetchProductsByCategory(categoryId);
      setProducts(results);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.productItem, { backgroundColor: theme.cardBackground }]}
      onPress={() => {
        if (user) {
          navigation.navigate('DetailScreen', { product: item, user });
        }
      }}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.is_favourite && (
          <View style={styles.favoriteIcon}>
            <Feather name="heart" size={16} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.productContent}>
        <Text style={[styles.productName, { color: theme.textColor }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: '#53B175' }]}>
          {item.price.toLocaleString('vi-VN')} đ
        </Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={14} color="#F3603F" />
          <Text style={styles.ratingText}>{item.rating || 0}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          // Xử lý thêm vào giỏ hàng
        }}
      >
        <Feather name="plus" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>{categoryName}</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#53B175" />
        </View>
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          numColumns={1}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textColor }]}>
            Không có sản phẩm nào trong danh mục này
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  productList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  productItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  productContent: {
    padding: 12,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F3603F',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    color: '#F3603F',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#53B175',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});

export default CategoryProductsScreen;
