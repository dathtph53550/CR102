import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { fetchCategories, Category } from '../services/api';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Array of background colors to use for categories
const backgroundColors = [
  "#E3F8E0", "#FEF4E5", "#FEEBEC", "#FAF0E6", "#FFF9D9", "#E6F2FF"
];

const ExploreScreen = () => {
  const [categories, setCategories] = useState<(Category & { color: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCategories();
      
      // Assign a background color to each category
      const categoriesWithColors = data.map((category, index) => ({
        ...category,
        color: backgroundColors[index % backgroundColors.length]
      }));
      
      setCategories(categoriesWithColors);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Tìm kiếm sản phẩm</Text>

      <TouchableOpacity 
        style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#333' : '#F2F3F2' }]}
        onPress={() => navigation.navigate('SearchScreen')}
        activeOpacity={0.7}
      >
        <Feather name="search" size={20} color={theme.textColor} style={styles.searchIcon} />
        <Text 
          style={[styles.searchInput, { color: isDarkMode ? '#999' : '#7C7C7C' }]} 
        >
          Tìm kiếm sản phẩm
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      ) : error ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.backgroundColor }]}>
          <Text style={[styles.errorText, { color: theme.textColor }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primaryColor }]} onPress={loadCategories}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.categoryItem, { backgroundColor: isDarkMode ? theme.cardBackground : item.color }]}>
              <Image source={{ uri: item.image }} style={styles.categoryImage} />
              <Text style={[styles.categoryText, { color: isDarkMode ? theme.textColor : '#000' }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundColor }]}>
              <Text style={[styles.emptyText, { color: theme.textColor }]}>Không tìm thấy danh mục nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    borderColor: 'gray',
    borderWidth: 0.5
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 8,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
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
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
  },
});
