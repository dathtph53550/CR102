import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Text, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Product, Comment } from '../types/product';
import { fetchComments, addToCart, toggleFavoriteStatus } from '../services/api';
import CommentSection from '../components/CommentSection';
import { RootStackParamList } from '../types/navigation';
import { FontAwesome } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'DetailScreen'>;

export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const { user: currentUser } = useUser();

  const { product: initialProduct, user: routeUser } = route.params || {};
  const [product, setProduct] = useState(initialProduct);
  const [isFavorite, setIsFavorite] = useState(initialProduct?.is_favourite || false);

  const loadComments = useCallback(async () => {
    if (!product) return;
    try {
      const fetchedComments = await fetchComments(product.id);
      setComments(fetchedComments);
      
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [product]);

  useEffect(() => {
    // Ensure favorite status is always in sync with product data
    if (product) {
      setIsFavorite(!!product.is_favourite);
    }
    loadComments();
  }, [loadComments, product]);

  const handleIncrement = useCallback(() => setQuantity(prev => prev + 1), []);
  const handleDecrement = useCallback(() => setQuantity(prev => (prev > 1 ? prev - 1 : 1)), []);
  
  const handleToggleFavorite = useCallback(async () => {
    if (!product || isTogglingFavorite) return;
    
    // Update UI immediately for better user experience
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    setProduct(prev => prev ? { ...prev, is_favourite: newFavoriteStatus } : prev);
    
    setIsTogglingFavorite(true);
    try {
      if (product) {
        const success = await toggleFavoriteStatus(product.id, newFavoriteStatus);
        
        if (!success) {
          // Revert UI if API call fails
          setIsFavorite(!newFavoriteStatus);
          setProduct(prev => prev ? { ...prev, is_favourite: !newFavoriteStatus } : prev);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert UI on error
      setIsFavorite(!newFavoriteStatus);
      setProduct(prev => prev ? { ...prev, is_favourite: !newFavoriteStatus } : prev);
    } finally {
      setIsTogglingFavorite(false);
    }
  }, [product, isFavorite, isTogglingFavorite]);
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAddingToCart(true);
      // Use the current user's ID from UserContext
      const userId = currentUser?.id ? String(currentUser.id) : "1";
      await addToCart(product.id.toString(), quantity, product.price, userId);
      
      // Use CommonActions.reset to reset the navigation state
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { 
              name: 'HomeScreen',
              state: {
                routes: [
                  { name: 'Cart' }
                ],
                index: 0,
              }
            },
          ],
        })
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product || !routeUser) {
    return null;
  }

  const renderHeader = () => (
    <>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productInfoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.productName}>{product.name}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            <FontAwesome 
              name={isFavorite ? "heart" : "heart-o"} 
              size={24} 
              color={isFavorite ? "red" : "#181725"} 
            />
            {isTogglingFavorite && (
              <ActivityIndicator 
                size="small" 
                color="#53B175" 
                style={styles.favoriteLoader} 
              />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.unit}>1kg, Giá</Text>
        <View style={styles.quantityPriceRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>{product.price.toFixed(3)} đ</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chi tiết Sản Phẩm</Text>
          <Feather name="chevron-down" size={20} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.sectionContent}>
          {product.description}
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thành phần dinh dưỡng</Text>
          <Text style={styles.nutritionWeight}>100gr</Text>
          <Feather name="chevron-right" size={20} color="#181725" />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Review</Text>
          <View style={styles.starContainer}>
            {[...Array(5)].map((_, index) => (
              <Feather key={index} name="star" size={16} color="#F3603F" style={styles.star} />
            ))}
          </View>
          <Feather name="chevron-right" size={20} color="#181725" />
        </TouchableOpacity>
      </View> */}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#181725" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="share" size={24} color="#181725" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[{ key: 'comments' }]} 
        renderItem={() => (
          <View style={styles.commentSection}>
            <CommentSection
              productId={product.id}
              comments={comments}
              onCommentAdded={loadComments}
              user={currentUser || routeUser}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      />

      <View style={styles.bottomButton}>
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E2E2E2',
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#F2F3F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#E2E2E2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  productInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
  },
  favoriteButton: {
    padding: 5,
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteLoader: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  unit: {
    fontSize: 16,
    color: '#7C7C7C',
    marginTop: 5,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    padding: 5,
  },
  quantityButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  quantityText: {
    fontSize: 20,
    color: '#181725',
  },
  quantityValue: {
    fontSize: 18,
    color: '#181725',
    paddingHorizontal: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
  sectionContent: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 10,
    lineHeight: 20,
  },
  nutritionWeight: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    marginLeft: 2,
  },
  commentSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 0,
    paddingTop: 20,
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  bottomButton: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  addToCartButton: {
    backgroundColor: '#53B175',
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});