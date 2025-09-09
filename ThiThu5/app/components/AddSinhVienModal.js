import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { addSinhVienOnAPI, updateSinhVien } from '../redux/action';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import * as Animatable from 'react-native-animatable';

const AddSinhVienModal = ({ visible, onClose, editData = null }) => {
  const dispatch = useDispatch();

  const [hoTen, setHoTen] = useState('');
  const [maSo, setMaSo] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [diemTB, setDiemTB] = useState('');
  const [lop, setLop] = useState('');
  const [anhDaiDien, setAnhDaiDien] = useState('');

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Màu cho các nút
  const buttonColorGreen = '#4CAF50'; // Màu xanh lá
  const buttonColorRed = '#F44336'; // Màu đỏ

  // Reset form values when modal opens or when editData changes
  useEffect(() => {
    if (visible) {
      if (editData) {
        // Format date from API (YYYY-MM-DDT...) to DD-MM-YYYY
        let displayDate = editData.ph53550_ngay_sinh || '';
        
        // If date is in ISO format, convert it to DD-MM-YYYY
        if (displayDate.includes('T')) {
          const date = new Date(displayDate);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          displayDate = `${day}-${month}-${year}`;
        } 
        // If date is in YYYY-MM-DD format, convert it to DD-MM-YYYY
        else if (displayDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = displayDate.split('-');
          displayDate = `${day}-${month}-${year}`;
        }
        
        // Nếu là chế độ sửa, điền dữ liệu hiện có
        setHoTen(editData.ph53550_ho_ten || '');
        setMaSo(editData.ph53550_ma_so || '');
        setNgaySinh(displayDate);
        setDiemTB(editData.ph53550_diem_tb?.toString() || '');
        setLop(editData.ph53550_lop || '');
        setAnhDaiDien(editData.ph53550_anh_dai_dien || '');
      } else {
        // Nếu là chế độ thêm mới, reset form
        resetForm();
      }
    }
  }, [visible, editData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate họ tên
    if (!hoTen.trim()) {
      newErrors.hoTen = 'Vui lòng nhập họ tên';
    } else if (hoTen.trim().length < 3) {
      newErrors.hoTen = 'Họ tên phải có ít nhất 3 ký tự';
    }
    
    // Validate mã số
    if (!maSo.trim()) {
      newErrors.maSo = 'Vui lòng nhập mã số';
    } else if (maSo.trim().length < 3) {
      newErrors.maSo = 'Mã số phải có ít nhất 3 ký tự';
    }
    
    // Validate ngày sinh
    if (!ngaySinh.trim()) {
      newErrors.ngaySinh = 'Vui lòng nhập ngày sinh';
    } else {
      // Date validation (dd-mm-yyyy format)
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      if (!dateRegex.test(ngaySinh) && !ngaySinh.includes('T')) {
        newErrors.ngaySinh = 'Ngày sinh phải có định dạng DD-MM-YYYY';
      }
    }
    
    // Validate điểm TB
    if (!diemTB.trim()) {
      newErrors.diemTB = 'Vui lòng nhập điểm TB';
    } else if (isNaN(parseFloat(diemTB))) {
      newErrors.diemTB = 'Điểm TB phải là số';
    } else if (parseFloat(diemTB) < 0 || parseFloat(diemTB) > 100) {
      newErrors.diemTB = 'Điểm TB phải nằm trong khoảng 0-100';
    }
    
    // Validate lớp
    if (!lop.trim()) {
      newErrors.lop = 'Vui lòng nhập lớp';
    }
    
    // Validate ảnh đại diện
    if (!anhDaiDien.trim()) {
      newErrors.anhDaiDien = 'Vui lòng nhập URL hình ảnh';
    } else if (!anhDaiDien.startsWith('http')) {
      newErrors.anhDaiDien = 'URL hình ảnh phải bắt đầu bằng http';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      // Convert date from DD-MM-YYYY to YYYY-MM-DD format for API
      let formattedDate = ngaySinh;
      if (ngaySinh.match(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)) {
        const [day, month, year] = ngaySinh.split('-');
        formattedDate = `${year}-${month}-${day}`;
      }

      const sinhVienData = {
        ph53550_ho_ten: hoTen,
        ph53550_ma_so: maSo,
        ph53550_ngay_sinh: formattedDate,
        ph53550_diem_tb: parseFloat(diemTB),
        ph53550_lop: lop,
        ph53550_anh_dai_dien: anhDaiDien
      };
  
      setIsLoading(true);
  
      // Nếu có editData thì gọi API cập nhật, ngược lại thì thêm mới
      if (editData) {
        const actionResult = dispatch(updateSinhVien({...sinhVienData, id: editData.id}));
        
        actionResult
          .then((response) => {
            // Check if the action was fulfilled or rejected
            if (response.error) {
              throw new Error(JSON.stringify(response.error));
            }
            console.log("Update success:", response.payload);
            alert('Cập nhật sinh viên thành công!');
            resetForm();
            onClose();
          })
          .catch((error) => {
            console.error('Failed to update student:', error);
            alert('Cập nhật sinh viên thất bại! ' + error.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        const actionResult = dispatch(addSinhVienOnAPI(sinhVienData));
        
        actionResult
          .then((response) => {
            // Check if the action was fulfilled or rejected
            if (response.error) {
              throw new Error(JSON.stringify(response.error));
            }
            console.log("Add success:", response.payload);
            alert('Thêm sinh viên thành công!');
            resetForm();
            onClose();
          })
          .catch((error) => {
            console.error('Failed to add student:', error);
            alert('Thêm sinh viên thất bại! ' + error.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Có lỗi xảy ra: ' + error.message);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setHoTen('');
    setMaSo('');
    setNgaySinh('');
    setDiemTB('');
    setLop('');
    setAnhDaiDien('');
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
            {editData ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên Mới'}
          </Text>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <CustomInput
              label="Họ Tên"
              value={hoTen}
              onChangeText={setHoTen}
              placeholder="Nhập họ tên (ít nhất 3 ký tự)"
              error={errors.hoTen}
            />
            
            <CustomInput
              label="Mã Số"
              value={maSo}
              onChangeText={setMaSo}
              placeholder="Nhập mã số (ít nhất 3 ký tự)"
              error={errors.maSo}
            />
            
            <CustomInput
              label="Ngày Sinh"
              value={ngaySinh}
              onChangeText={setNgaySinh}
              placeholder="Nhập ngày sinh (DD-MM-YYYY)"
              error={errors.ngaySinh}
            />
            
            <CustomInput
              label="Điểm TB"
              value={diemTB}
              onChangeText={setDiemTB}
              placeholder="Nhập điểm TB (0-100)"
              keyboardType="numeric"
              error={errors.diemTB}
            />
             <CustomInput
              label="Lớp"
              value={lop}
              onChangeText={setLop}
              placeholder="Nhập lớp"
              error={errors.lop}
            />
            
            <CustomInput
              label="Hình ảnh (URL)"
              value={anhDaiDien}
              onChangeText={setAnhDaiDien}
              placeholder="Nhập URL hình ảnh (bắt đầu bằng http)"
              error={errors.anhDaiDien}
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

export default AddSinhVienModal; 