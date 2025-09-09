import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  fetchProducts, 
  fetchCategories, 
  deleteProduct, 
  addProduct, 
  updateProduct,
  setSelectedProduct,
  setModalVisible,
  clearSelectedProduct
} from '../redux/reducers/productSlice';
import { useFocusEffect } from '@react-navigation/native';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
  is_hot?: boolean;
  is_favourite?: boolean;
  viewed_at?: string;
  created_at?: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
}

const ProductManagement = () => {
  const dispatch = useAppDispatch();
  // Connect to the adminProducts slice
  const { products, categories, loading, error, selectedProduct, isModalVisible } = 
    useAppSelector(state => state.adminProducts);
    
  // Debug log
  console.log('Redux state:', {
    products, 
    categories, 
    isModalVisible, 
    selectedProduct
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category_id: ''
  });

  // Load products and categories when component mounts
  // useEffect(() => {
  //   dispatch(fetchProducts());
  //   dispatch(fetchCategories());
  // }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }, [dispatch])
  );

  // Set form data when selectedProduct changes (for edit)
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price.toString(),
        image: selectedProduct.image,
        category_id: selectedProduct.category_id
      });
    } else {
      // Reset form data when adding a new product
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category_id: categories.length > 0 ? categories[0].id : ''
      });
    }
  }, [selectedProduct, categories]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error);
    }
  }, [error]);

  const handleDeleteProduct = (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteProduct(id)).unwrap();
              Alert.alert('Thành công', 'Đã xóa sản phẩm');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
            }
          }
        }
      ]
    );
  };

  const handleAddProduct = () => {
    // Open modal with empty form
    dispatch(clearSelectedProduct());
    dispatch(setModalVisible(true));
  };
  
  const handleEditProduct = (product: Product) => {
    dispatch(setSelectedProduct(product));
    dispatch(setModalVisible(true));
  };

  const handleSaveProduct = async () => {
    // Validate form data
    if (!formData.name || !formData.description || !formData.price || !formData.image || !formData.category_id) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm');
      return;
    }
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      if (selectedProduct) {
        // Update existing product
        await dispatch(updateProduct({
          ...selectedProduct,
          ...productData
        })).unwrap();
        Alert.alert('Thành công', 'Đã cập nhật sản phẩm');
      } else {
        // Add new product
        await dispatch(addProduct(productData)).unwrap();
        Alert.alert('Thành công', 'Đã thêm sản phẩm mới');
      }
      
      // Close modal
      dispatch(setModalVisible(false) as any);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm');
    }
  };
  
  const handleCloseModal = () => {
    dispatch(setModalVisible(false));
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render the product form modal
  const renderProductFormModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Tên sản phẩm</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Nhập tên sản phẩm"
              />
              
              <Text style={styles.inputLabel}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Nhập mô tả sản phẩm"
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.inputLabel}>Giá ( 1.000 đ )</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="Nhập giá sản phẩm"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>URL Hình ảnh</Text>
              <TextInput
                style={styles.input}
                value={formData.image}
                onChangeText={(value) => handleInputChange('image', value)}
                placeholder="Nhập URL hình ảnh"
              />
              
              <Text style={styles.inputLabel}>Danh mục</Text>
              <View style={styles.categoryPicker}>
                {categories.map((category: Category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      formData.category_id === category.id && styles.selectedCategory
                    ]}
                    onPress={() => handleInputChange('category_id', category.id)}
                  >
                    <Text style={[
                      styles.categoryText,
                      formData.category_id === category.id && styles.selectedCategoryText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {formData.image ? (
                <View style={styles.imagePreviewContainer}>
                  <Text style={styles.inputLabel}>Xem trước hình ảnh</Text>
                  <Image
                    source={{ uri: formData.image }}
                    style={styles.imagePreview}
                    defaultSource={require('../../assets/images/react-logo.png')}
                  />
                </View>
              ) : null}
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProduct}
              >
                <Text style={styles.saveButtonText}>
                  {selectedProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage} 
        defaultSource={require('../../assets/images/react-logo.png')}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productRating}>
          <Text style={styles.productPrice}>Giá: {item.price.toFixed(3)}</Text>
          <Text style={styles.productCategory}>Danh mục: #{item.category_id}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEditProduct(item)}
        >
          <Feather name="edit" size={20} color="#FF9800" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Feather name="trash-2" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh Sách Sản Phẩm</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <Text style={styles.addButtonText}>Thêm Sản Phẩm</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      {renderProductFormModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  addButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  productRating: {
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#FF6347',
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  formContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C7C7C',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryOption: {
    backgroundColor: '#F5F5F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategory: {
    backgroundColor: '#FF6347',
    borderColor: '#FF6347',
  },
  categoryText: {
    color: '#181725',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 24,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  }
});

export default ProductManagement;
