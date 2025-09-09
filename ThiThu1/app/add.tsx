import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';

import { addXeMayAsync } from './redux/xeMaySlice';
import CustomInput from './components/CustomInput';
import CustomButton from './components/CustomButton';

// Định nghĩa các kiểu dữ liệu
interface FormErrors {
  ten_xe_ph53550?: string | null;
  mau_sac_ph53550?: string | null;
  gia_ban_ph53550?: string | null;
  mo_ta_ph53550?: string | null;
  hinh_anh_ph53550?: string | null;
}

interface FormData {
  ten_xe_ph53550: string;
  mau_sac_ph53550: string;
  gia_ban_ph53550: string;
  mo_ta_ph53550: string;
  hinh_anh_ph53550: string;
}

export default function AddScreen() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    ten_xe_ph53550: '',
    mau_sac_ph53550: '',
    gia_ban_ph53550: '',
    mo_ta_ph53550: '',
    hinh_anh_ph53550: 'https://via.placeholder.com/150',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kiểm tra và yêu cầu quyền truy cập camera và thư viện ảnh
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Cảnh báo', 'Chúng tôi cần quyền truy cập camera để bạn có thể chụp ảnh.');
      }
      
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus !== 'granted') {
        Alert.alert('Cảnh báo', 'Chúng tôi cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh.');
      }
    })();
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.ten_xe_ph53550.trim()) {
      newErrors.ten_xe_ph53550 = 'Tên xe không được để trống';
    }
    
    if (!formData.mau_sac_ph53550.trim()) {
      newErrors.mau_sac_ph53550 = 'Màu sắc không được để trống';
    }
    
    if (!formData.gia_ban_ph53550) {
      newErrors.gia_ban_ph53550 = 'Giá bán không được để trống';
    } else if (isNaN(parseFloat(formData.gia_ban_ph53550))) {
      newErrors.gia_ban_ph53550 = 'Giá bán phải là số';
    }
    
    if (!formData.mo_ta_ph53550.trim()) {
      newErrors.mo_ta_ph53550 = 'Mô tả không được để trống';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Convert price to number
        const submissionData = {
          ...formData,
          gia_ban_ph53550: parseFloat(formData.gia_ban_ph53550),
        };
        
        await dispatch(addXeMayAsync(submissionData) as any);
        Alert.alert('Thành công', 'Thêm xe máy thành công!');
        router.back();
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm xe máy.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSelectImage = async () => {
    try {
      // Mở thư viện ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      console.log('Pick image result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        setFormData({
          ...formData,
          hinh_anh_ph53550: selectedImage.uri,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn hình ảnh: ' + error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Mở camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      console.log('Camera result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const takenPhoto = result.assets[0];
        
        setFormData({
          ...formData,
          hinh_anh_ph53550: takenPhoto.uri,
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh: ' + error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.formContainer}>
        <Text style={styles.title}>Thêm Xe Máy Mới</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: formData.hinh_anh_ph53550 }} 
            style={styles.imagePreview} 
          />
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
              <Text style={styles.imageButtonText}>Chọn ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
              <Text style={styles.imageButtonText}>Chụp ảnh</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <CustomInput
          label="Tên xe"
          value={formData.ten_xe_ph53550}
          onChangeText={(text: string) => handleChange('ten_xe_ph53550', text)}
          placeholder="Nhập tên xe"
          error={errors.ten_xe_ph53550 || null}
        />
        
        <CustomInput
          label="Màu sắc"
          value={formData.mau_sac_ph53550}
          onChangeText={(text: string) => handleChange('mau_sac_ph53550', text)}
          placeholder="Nhập màu sắc"
          error={errors.mau_sac_ph53550 || null}
        />
        
        <CustomInput
          label="Giá bán (VNĐ)"
          value={formData.gia_ban_ph53550.toString()}
          onChangeText={(text: string) => handleChange('gia_ban_ph53550', text)}
          placeholder="Nhập giá bán"
          keyboardType="numeric"
          error={errors.gia_ban_ph53550 || null}
        />
        
        <CustomInput
          label="Mô tả"
          value={formData.mo_ta_ph53550}
          onChangeText={(text: string) => handleChange('mo_ta_ph53550', text)}
          placeholder="Nhập mô tả"
          multiline={true}
          numberOfLines={4}
          error={errors.mo_ta_ph53550 || null}
        />
        
        <View style={styles.buttonContainer}>
          <CustomButton 
            title={isSubmitting ? "Đang xử lý..." : "Thêm Xe Máy"} 
            onPress={handleSubmit}
            style={styles.submitButton}
          />
          <CustomButton 
            title="Hủy" 
            onPress={() => router.back()} 
            type="secondary"
            style={styles.cancelButton}
          />
        </View>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
  submitButton: {
    marginBottom: 10,
  },
  cancelButton: {
    marginBottom: 10,
  },
}); 