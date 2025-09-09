import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addListOnAPI } from './redux/action'
import CustomInput from './componets/CustomInput'
import CustomButton from './componets/CustomButton'
import { router } from 'expo-router'
import * as Animatable from 'react-native-animatable'

export default function Add() {
  const [formData, setFormData] = useState({
    ten_xe_ph53550: '',
    mau_sac_ph53550: '',
    gia_ban_ph53550: '',
    mo_ta_ph53550: '',
    hinh_anh_ph53550: ''
  });

  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: field === 'gia_ban_ph53550' ? parseFloat(value) || 0 : value
    });
  };

  const handleSubmit = async () => {
    if (!formData.ten_xe_ph53550 || !formData.mau_sac_ph53550 || !formData.gia_ban_ph53550 || !formData.hinh_anh_ph53550 || !formData.mo_ta_ph53550) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin sách');
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
            label="Tên sách"
            placeholder="Nhập tên sách"
            value={formData.ten_xe_ph53550}
            onChangeText={(text) => handleInputChange('ten_xe_ph53550', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="Màu sắc"
            placeholder="Nhập màu sắc"
            value={formData.mau_sac_ph53550}
            onChangeText={(text) => handleInputChange('mau_sac_ph53550', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="Giá bán"
            placeholder="Nhập giá bán"
            value={formData.gia_ban_ph53550.toString()}
            onChangeText={(text) => handleInputChange('gia_ban_ph53550', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="Mô tả"
            placeholder="Nhập mô tả sách"
            value={formData.mo_ta_ph53550}
            onChangeText={(text) => handleInputChange('mo_ta_ph53550', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
          />
        </View>

        <View style={styles.formGroup}>
          <CustomInput
            label="URL Hình ảnh"
            placeholder="Nhập URL hình ảnh"
            value={formData.hinh_anh_ph53550}
            onChangeText={(text) => handleInputChange('hinh_anh_ph53550', text)}
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