import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addListOnAPI } from './redux/action'
import CustomInput from './components/CustomInput'
import CustomButton from './components/CustomButton'
import { router } from 'expo-router'
import * as Animatable from 'react-native-animatable'



// "ph53550_hoten": "Nguyễn Văn A",
//             "ph53550_mon_thi": "Toán",
//             "ph53550_hinh_anh": "https://via.placeholder.com/150",
//             "ph53550_ngay_thi": "22-04-2025",
//             "ph53550_ca_thi": 1
export default function Add() {
  const [formData, setFormData] = useState({
    ph53550_hoten: '',
    ph53550_mon_thi: '',
    ph53550_ngay_thi: '',
    ph53550_ca_thi: '',
    ph53550_hinh_anh: ''
  });

  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: field === 'ph53550_ca_thi' ? parseFloat(value) || 0 : value
    });
  };

  const handleSubmit = async () => {
    if (!formData.ph53550_hoten || !formData.ph53550_mon_thi || !formData.ph53550_ngay_thi || !formData.ph53550_ca_thi || !formData.ph53550_hinh_anh) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin sách');
      return;
    }
    if(formData.ph53550_ca_thi < 1 || formData.ph53550_ca_thi > 6){
      Alert.alert('Lỗi', 'Ca thi phải nằm trong khoảng từ 1 đến 6');
      return;
    }
    if(!/^\d{2}-\d{2}-\d{4}$/.test(formData.ph53550_ngay_thi)){
      Alert.alert('Lỗi', 'Ngày thi phải đúng định dạng DD-MM-YYYY');
      return;
    }

    try {
      const result = await dispatch(addListOnAPI(formData));
      if (!result.error) {
        Alert.alert('Thành công', 'Thêm sách thành công', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm sách. Vui lòng thử lại!');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thêm sách');
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800}>
        <View style={styles.formGroup}>
          <CustomInput
            label="Họ Tên"
            placeholder="Nhập họ tên"
            value={formData.ph53550_hoten}
            onChangeText={(text) => handleInputChange('ph53550_hoten', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="Môn Thi"
            placeholder="Nhập môn thi"
            value={formData.ph53550_mon_thi}
            onChangeText={(text) => handleInputChange('ph53550_mon_thi', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="Ngày Thi"
            placeholder="Nhập ngày thi"
            value={formData.ph53550_ngay_thi}
            onChangeText={(text) => handleInputChange('ph53550_ngay_thi', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="Ca Thi"
            placeholder="Nhập ca thi"
            value={formData.ph53550_ca_thi.toString()}
            onChangeText={(text) => handleInputChange('ph53550_ca_thi', text)}
            keyboardType='numeric'
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="URL Hình ảnh"
            placeholder="Nhập URL hình ảnh"
            value={formData.ph53550_hinh_anh}
            onChangeText={(text) => handleInputChange('ph53550_hinh_anh', text)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Lưu"
            onPress={handleSubmit}
            color="green"
            style={styles.submitButton}
          />
          <CustomButton
            title="Hủy"
            onPress={() => router.back()}
            color="gray"
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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
}); 