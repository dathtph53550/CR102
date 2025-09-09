import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeProvider';
import { useUser } from '../context/UserContext';
import { loadCategories } from '../redux/reducers/productReducer';
import { searchProducts, fetchProductsByCategory } from '../services/api';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const { theme, isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const inputRef = React.useRef<TextInput>(null);

  // Lấy danh mục từ Redux store
  const { categories } = useSelector((state: any) => state.products);

  useEffect(() => {
    // Focus vào ô tìm kiếm khi màn hình hiển thị
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    // Lấy danh mục từ API
    dispatch(loadCategories() as any);
  }, [dispatch]);

  const handleSearch = async () => {
    if (searchText.trim() === '') return;
    
    setIsSearching(true);
    setSelectedCategory(null);
    try {
      const results = await searchProducts(searchText);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
      Keyboard.dismiss();
    }
  };

  const fetchProductsByCategoryId = async (categoryId: string | number) => {
    setIsSearching(true);
    try {
      const results = await fetchProductsByCategory(categoryId);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setSelectedCategory(null);
    setCategoryName('');
    inputRef.current?.focus();
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        { 
          backgroundColor: item.name === 'Fruits' ? '#E6F2E7' : '#FFF5E5',
          borderRadius: 15,
          borderColor: selectedCategory === item.id ? '#53B175' : 'transparent',
          borderWidth: selectedCategory === item.id ? 2 : 0,
        }
      ]}
      onPress={() => {
        // Chuyển đến màn hình CategoryProductsScreen
        navigation.navigate('CategoryProductsScreen', {
          categoryId: item.id,
          categoryName: item.name
        });
      }}
    >
      <Image source={{ uri: item.image }} style={styles.categoryIcon} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

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
        <Text style={[styles.productPrice, { color: theme.primaryColor }]}>
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
        {/* <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity> */}
        <Text style={[styles.headerTitle, { color: theme.textColor, flex: 1, textAlign: 'center' }]}>Tìm kiếm sản phẩm</Text>
      </View>
      
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: '#F2F3F2', borderRadius: 15, marginHorizontal: 20, marginVertical: 15 }]}>
        <Feather name="search" size={20} color="#7C7C7C" style={styles.searchIcon} />
        <TextInput 
          ref={inputRef}
          style={[styles.searchInput, { color: theme.textColor }]}
          placeholder="Tìm kiếm sản phẩm"
          placeholderTextColor="#7C7C7C"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearSearch}
          >
            <Feather name="x" size={18} color={theme.textColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#53B175" />
        </View>
      ) : searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          {selectedCategory && (
            <Text style={[styles.resultTitle, { color: theme.textColor }]}>
              Sản phẩm thuộc danh mục: {categoryName}
            </Text>
          )}
          {searchText.trim() !== '' && !selectedCategory && (
            <Text style={[styles.resultTitle, { color: theme.textColor }]}>
              Kết quả tìm kiếm cho: {searchText}
            </Text>
          )}
          <FlatList
            data={searchResults}
            numColumns={1}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProductItem}
            contentContainerStyle={styles.productList}
          />
        </View>
      ) : (
        <View style={styles.initialContent}>          
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Danh mục
          </Text>
          <FlatList
            data={categories}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCategoryItem}
            contentContainerStyle={styles.categoriesList}
            showsVerticalScrollIndicator={false}
          />
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
    textAlign: 'center',
    marginRight: 24, // Để cân đối với nút back bên trái
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryItem: {
    flex: 1,
    margin: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  productList: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 20,
  },
  productItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 0,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  productContent: {
    padding: 10,
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
    color: '#53B175',
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

export default SearchScreen;
