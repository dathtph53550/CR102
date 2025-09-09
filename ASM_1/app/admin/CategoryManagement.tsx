import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  fetchCategories,
  deleteCategory,
  addCategory,
  updateCategory,
  setSelectedCategory,
  setModalVisible,
  clearSelectedCategory
} from '../redux/reducers/categorySlice';

interface Category {
  id: string;
  name: string;
  image: string;
}

const CategoryManagement = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error, selectedCategory, isModalVisible } = 
    useAppSelector(state => state.adminCategories);
    
  // Debug log
  console.log('Redux categories state:', {
    categories, 
    isModalVisible, 
    selectedCategory
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });

  // Load categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Set form data when selectedCategory changes (for edit)
  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        image: selectedCategory.image
      });
    } else {
      // Reset form data when adding a new category
      setFormData({
        name: '',
        image: ''
      });
    }
  }, [selectedCategory]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error);
    }
  }, [error]);

  const handleDeleteCategory = (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa danh mục này? Sản phẩm thuộc danh mục này sẽ không có danh mục.',
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
              await dispatch(deleteCategory(id)).unwrap();
              Alert.alert('Thành công', 'Đã xóa danh mục');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa danh mục');
            }
          }
        }
      ]
    );
  };
  
  const handleAddCategory = () => {
    // Open modal with empty form
    dispatch(clearSelectedCategory() as any);
    dispatch(setModalVisible(true) as any);
  };
  
  const handleEditCategory = (category: Category) => {
    dispatch(setSelectedCategory(category) as any);
  };

  const handleSaveCategory = async () => {
    // Validate form data
    if (!formData.name || !formData.image) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin danh mục');
      return;
    }
    
    try {
      if (selectedCategory) {
        // Update existing category
        await dispatch(updateCategory({
          ...selectedCategory,
          ...formData
        } as any) as any).unwrap();
        Alert.alert('Thành công', 'Đã cập nhật danh mục');
      } else {
        // Add new category
        await dispatch(addCategory(formData as any) as any).unwrap();
        Alert.alert('Thành công', 'Đã thêm danh mục mới');
      }
      
      // Close modal
      dispatch(setModalVisible(false) as any);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu danh mục');
    }
  };
  
  const handleCloseModal = () => {
    dispatch(setModalVisible(false) as any);
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render category form modal
  const renderCategoryFormModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
            </Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Tên danh mục</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Nhập tên danh mục"
            />
            
            <Text style={styles.inputLabel}>URL Hình ảnh</Text>
            <TextInput
              style={styles.input}
              value={formData.image}
              onChangeText={(value) => handleInputChange('image', value)}
              placeholder="Nhập URL hình ảnh"
            />
            
            {/* Preview Image */}
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
              onPress={handleSaveCategory}
            >
              <Text style={styles.saveButtonText}>
                {selectedCategory ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryInfo}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.categoryImage} 
          defaultSource={require('../../assets/images/react-logo.png')}
        />
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditCategory(item)}
        >
          <Feather name="edit" size={20} color="#FF9800" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteCategory(item.id)}
        >
          <Feather name="trash-2" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản Lý Danh Mục</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCategory}
        >
          <Text style={styles.addButtonText}>Thêm Danh Mục</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      {renderCategoryFormModal()}
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
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  categoryId: {
    fontSize: 12,
    color: '#7C7C7C',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
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

export default CategoryManagement;
