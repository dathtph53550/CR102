import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, Platform, SafeAreaView, Alert,Animated} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/product';
import { fetchBanners, fetchHotProducts, fetchHistoryProducts, fetchProducts, updateViewedProduct, addToCart, fetchNotifications } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [banners, setBanners] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const bannerRef = useRef<FlatList>(null);
  const { user } = useUser();
  const { theme } = useTheme();

  const bellShakeAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const shakeInterval = setInterval(() => {
        Animated.sequence([
          Animated.timing(bellShakeAnimation, {
            toValue: 0.3,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(bellShakeAnimation, {
            toValue: -0.3,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(bellShakeAnimation, {
            toValue: 0.3,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(bellShakeAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          })
        ]).start();
      }, 1500);
      
      return () => clearInterval(shakeInterval);
    }
  }, [notifications, bellShakeAnimation]);
  


  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadBanners(),
        loadAllProducts(),
        loadHotProducts(),
        loadHistoryProducts(),
        loadNotifications()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const intervalId = setInterval(() => {
        if (currentBannerIndex < banners.length - 1) {
          setCurrentBannerIndex(currentBannerIndex + 1);
          bannerRef.current?.scrollToIndex({
            index: currentBannerIndex + 1,
            animated: true,
          });
        } else {
          setCurrentBannerIndex(0);
          bannerRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        }
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [currentBannerIndex, banners.length]);

  // Use the UserContext instead of loading from AsyncStorage directly
  useEffect(() => {
    if (user) {
      loadHistoryProducts(String(user.id));
      loadNotifications();
    }
  }, [user]);

  const loadBanners = async () => {
    try {
      const data = await fetchBanners();
      setBanners(data.filter(banner => banner && (banner.id !== undefined || banner.id_banner !== undefined)));
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  const loadAllProducts = async () => {
    try {
      const data = await fetchProducts();
      setAllProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadHotProducts = async () => {
    try {
      const data = await fetchHotProducts();
      setHotProducts(data);
    } catch (error) {
      console.error('Error loading hot products:', error);
    }
  };

  const loadHistoryProducts = async (userId = "1") => {
    try {
      const data = await fetchHistoryProducts(userId);
      setHistoryProducts(data);
    } catch (error) {
      console.error('Error loading history products:', error);
    }
  };
  
  const loadNotifications = async () => {
    try {
      const userId = user?.id ? String(user.id) : "1";
      const data = await fetchNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleProductPress = async (product: Product) => {
    try {
      console.log(product.id)
      await updateViewedProduct(String(product.id));
      if (user) {
        await loadHistoryProducts(String(user.id));
      }
    } catch (error) {
      console.error("Error updating viewed_at:", error);
    }
  
    navigation.navigate('DetailScreen', { 
      product,
      user: user || { 
        id: 1,
        full_name: 'User',
        email: 'user@example.com'
      }
    });
  };

  const handleAddToCart = async (product: Product) => {
    setAddingToCartId(String(product.id));
    try {
      if (user) {
        await addToCart(String(product.id), 1, product.price, String(user.id));
        Alert.alert('Success', 'Product added to cart!');
      } else {
        Alert.alert('Error', 'Please login to add products to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    } finally {
      setAddingToCartId(null);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
      >
        <View style={styles.productImageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage}
            resizeMode="contain"
          />
          {item.is_hot && <Text style={styles.hotLabel}>HOT</Text>}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={1}>{item.description}</Text>
          <Text style={styles.productUnit}>{item.unit}</Text>
        </View>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>{item.price.toFixed(3)} đ</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
            disabled={addingToCartId === String(item.id)}
          >
            {addingToCartId === String(item.id) ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <AntDesign name="plus" size={14} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHistoryProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage} 
          resizeMode="contain"
        />
        {item.viewed_at && (
          <View style={styles.viewedBadge}>
            <Text style={styles.viewedText}>
              {formatViewedTime(item.viewed_at)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <View style={styles.productPriceRow}>
        <Text style={styles.productPrice}>{item.price.toFixed(3)} đ</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
          disabled={addingToCartId === String(item.id)}
        >
          {addingToCartId === String(item.id) ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <AntDesign name="plus" size={14} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const formatViewedTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
  
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays === 1 ? 'ngày' : 'ngày'} trước`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours === 1 ? 'giờ' : 'giờ'} trước`;
    } else if (diffInMins > 0) {
      return `${diffInMins} ${diffInMins === 1 ? 'phút' : 'phút'} trước`;
    } else {
      return 'vừa xong';
    }
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBannerItem = ({ item, index }: { item: any; index: number }) => {
    // Safety check for undefined items
    if (!item || !item.image) {
      return (
        <View style={styles.bannerImageContainer}>
          <View style={[styles.bannerImage, { backgroundColor: '#F8A44C' }]} />
        </View>
      );
    }
    
    return (
      <View style={styles.bannerImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderBannerDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentBannerIndex ? '#53B175' : '#E2E2E2' }
            ]}
          />
        ))}
      </View>
    );
  };

  const onBannerScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index !== currentBannerIndex) {
      setCurrentBannerIndex(index);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {isLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      ) : (
      <FlatList
        data={[1]}
        renderItem={() => (
          <View>
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.searchContainer}
                onPress={() => navigation.navigate('SearchScreen')}
                activeOpacity={0.7}
              >
                <Feather name="search" size={20} color={theme.textColor} style={styles.searchIcon} />
                <Text
                  style={[styles.searchInput, { color: theme.textColor === '#000' ? '#7C7C7C' : '#999' }]}
                >
                  Tìm kiếm sản phẩm
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity 
                style={styles.notificationContainer}
                onPress={() => navigation.navigate('NotificationScreen')}
              >
                <Feather name="bell" size={24} color={theme.textColor} />
                {notifications.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity> */}
              <TouchableOpacity 
                style={styles.notificationContainer}
                onPress={() => navigation.navigate('NotificationScreen')}
              >
                <Animated.View
                  style={{
                    transform: [{ rotate: bellShakeAnimation.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-30deg', '30deg']
                    })}]
                  }}
                >
                  <Feather name="bell" size={24} color={theme.textColor} />
                  {notifications.length > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>

            </View>

            <View style={styles.bannerSlideContainer}>
              <FlatList
                ref={bannerRef}
                data={banners}
                renderItem={renderBannerItem}
                keyExtractor={(item) => {
                  if (!item) return Math.random().toString();
                  // Handle both possible id properties
                  if (item.id_banner !== undefined) return item.id_banner.toString();
                  if (item.id !== undefined) return item.id.toString();
                  return Math.random().toString();
                }}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onBannerScroll}
                scrollEventThrottle={16}
              />
              {renderBannerDots()}
            </View>

            {/* All Products Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sản Phẩm</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllProductsScreen', { type: 'all', title: 'All Products' })}>
                <Text style={styles.seeAllText}>xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              style={styles.productsContainer}
              data={allProducts.slice(0, 4)}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text>No products available</Text>
                </View>
              }
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sản Phẩm Hot</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllProductsScreen', { type: 'hot', title: 'Hot Products' })}>
                <Text style={styles.seeAllText}>xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={hotProducts.slice(0, 4)}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text>No hot products available</Text>
                </View>
              }
            />

            {historyProducts.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Sản Phẩm đã xem</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('AllProductsScreen', { type: 'history', title: 'History Products' })}>
                    <Text style={styles.seeAllText}>xem tất cả</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={historyProducts.slice(0, 4)}
                  renderItem={renderHistoryProductItem}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productsContainer}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text>No history available</Text>
                    </View>
                  }
                />
              </>
            )}

            <View style={styles.bottomSpace} />
          </View>
        )}
        keyExtractor={() => "main"}
      />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    position: 'relative',
  },
  headerLogo: {
    width: 25,
    height: 30,
    position: 'absolute',
    top: 10
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginRight: 10,
  },
  notificationContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#181725',
  },
  bannerSlideContainer: {
    marginBottom: 20,
  },
  bannerImageContainer: {
    width: width,
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: '100%',
    height: 115,
    borderRadius: 15,
    backgroundColor: '#F8A44C',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 35,
    top: 30,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E423F',
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#3E423F',
    marginTop: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#53B175',
  },
  productsContainer: {
    paddingLeft: 20,
    marginBottom: 25,
  },
  productCard: {
    width: 170,
    marginRight: 15,
    marginBottom: 10,
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
  },
  productImageContainer: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
    height: 20,
    lineHeight: 16,
  },
  productUnit: {
    fontSize: 14,
    color: '#7C7C7C',
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
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 15,
  },
  categoryCard: {
    width: 240,
    height: 100,
    marginRight: 15,
    backgroundColor: '#F8A44C20',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  bottomSpace: {
    height: 80,
  },
  viewedTime: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  emptyContainer: {
    width: width - 40,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 15,
    marginHorizontal: 20
  },
  hotLabel: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  viewedBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(83, 177, 117, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  viewedText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  
  
});