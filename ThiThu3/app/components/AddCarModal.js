import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { addCarOnAPI, updateCar } from '../redux/action';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import * as Animatable from 'react-native-animatable';

const AddCarModal = ({ visible, onClose, editData = null }) => {
  const dispatch = useDispatch();
  const [tenXe, setTenXe] = useState('');
  const [mauSac, setMauSac] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [moTa, setMoTa] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Màu cho các nút
  const buttonColorGreen = '#4CAF50'; // Màu xanh lá
  const buttonColorRed = '#F44336'; // Màu đỏ

  // Reset form values when modal opens or when editData changes
  useEffect(() => {
    if (visible) {
      if (editData) {
        // Nếu là chế độ sửa, điền dữ liệu hiện có
        setTenXe(editData.ten_xe || '');
        setMauSac(editData.mau_sac || '');
        setGiaBan(editData.gia_ban ? String(editData.gia_ban) : '');
        setMoTa(editData.mo_ta || '');
        setHinhAnh(editData.hinh_anh || '');
      } else {
        // Nếu là chế độ thêm mới, reset form
        resetForm();
      }
    }
  }, [visible, editData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!tenXe.trim()) newErrors.tenXe = 'Vui lòng nhập tên xe';
    if (!mauSac.trim()) newErrors.mauSac = 'Vui lòng nhập màu sắc';
    
    if (!giaBan.trim()) {
      newErrors.giaBan = 'Vui lòng nhập giá bán';
    } else if (isNaN(parseFloat(giaBan)) || parseFloat(giaBan) <= 0) {
      newErrors.giaBan = 'Giá bán phải là số dương';
    }
    
    if (!moTa.trim()) newErrors.moTa = 'Vui lòng nhập mô tả';
    if (!hinhAnh.trim()) {
      newErrors.hinhAnh = 'Vui lòng nhập URL hình ảnh';
    } else if (!hinhAnh.startsWith('http')) {
      newErrors.hinhAnh = 'URL hình ảnh không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const carData = {
      ten_xe: tenXe,
      mau_sac: mauSac,
      gia_ban: parseFloat(giaBan),
      mo_ta: moTa,
      hinh_anh: hinhAnh
    };

    setIsLoading(true);

    // Nếu có editData thì gọi API cập nhật, ngược lại thì thêm mới
    if (editData) {
      dispatch(updateCar({...carData, id: editData.id}))
        .unwrap()
        .then(() => {
          alert('Cập nhật xe thành công!');
          resetForm();
          onClose();
        })
        .catch((error) => {
          console.error('Failed to update car:', error);
          alert('Cập nhật xe thất bại!');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      dispatch(addCarOnAPI(carData))
        .unwrap()
        .then(() => {
          alert('Thêm xe thành công!');
          resetForm();
          onClose();
        })
        .catch((error) => {
          console.error('Failed to add car:', error);
          alert('Thêm xe thất bại!');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setTenXe('');
    setMauSac('');
    setGiaBan('');
    setMoTa('');
    setHinhAnh('');
    setErrors({});
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animatable.View 
          animation="zoomIn" 
          duration={500} 
          style={styles.modalView}
        >
          <Text style={styles.modalTitle}>
            {editData ? 'Cập Nhật Xe Máy' : 'Thêm Xe Máy Mới'}
          </Text>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <CustomInput
              label="Tên xe"
              value={tenXe}
              onChangeText={setTenXe}
              placeholder="Nhập tên xe máy"
              error={errors.tenXe}
            />
            
            <CustomInput
              label="Màu sắc"
              value={mauSac}
              onChangeText={setMauSac}
              placeholder="Nhập màu sắc"
              error={errors.mauSac}
            />
            
            <CustomInput
              label="Giá bán"
              value={giaBan}
              onChangeText={setGiaBan}
              placeholder="Nhập giá bán"
              keyboardType="numeric"
              error={errors.giaBan}
            />
            
            <CustomInput
              label="Mô tả"
              value={moTa}
              onChangeText={setMoTa}
              placeholder="Nhập mô tả xe máy"
              multiline
              numberOfLines={4}
              error={errors.moTa}
            />
            
            <CustomInput
              label="Hình ảnh (URL)"
              value={hinhAnh}
              onChangeText={setHinhAnh}
              placeholder="Nhập URL hình ảnh"
              error={errors.hinhAnh}
            />
            
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <CustomButton 
                title="Hủy" 
                color={buttonColorRed} 
                textColor="white"
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              />
            </View>
              
            <View style={styles.buttonWrapper}>
              {isLoading ? (
                <ActivityIndicator size="large" color={buttonColorGreen} />
              ) : (
                <CustomButton 
                  title={editData ? "Cập Nhật" : "Thêm"} 
                  color={buttonColorGreen} 
                  textColor="white"
                  onPress={handleSubmit} 
                />
              )}
            </View>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%', // Tăng kích thước để hiển thị đủ các trường
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333'
  },
  formContainer: {
    maxHeight: 450, // Tăng kích thước để hiển thị đầy đủ form
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    ...Platform.select({
      android: {
        minHeight: 48,
      }
    }),
  }
});

export default AddCarModal; 