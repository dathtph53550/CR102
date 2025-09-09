import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateListOnAPI } from './redux/action'
import CustomInput from './componets/CustomInput'
import CustomButton from './componets/CustomButton'
import { router, useLocalSearchParams } from 'expo-router'
import * as Animatable from 'react-native-animatable'

export default function Edit() {
  const [formData, setFormData] = useState({
    id: '',
    ten_xe_ph53550: '',
    mau_sac_ph53550: '',
    gia_ban_ph53550: '',
    mo_ta_ph53550: '',
    hinh_anh_ph53550: ''
  });

  const params = useLocalSearchParams();
  const listId = params.id;

  const dispatch = useDispatch();
  const list = useSelector(state => state.listInStore?.list || []);

  useEffect(() => {
    if (listId) {
      const listToEdit = list.find(item => item.id.toString() === listId.toString());
      if (listToEdit) {
        setFormData({
          id: listToEdit.id,
          ten_xe_ph53550: listToEdit.ten_xe_ph53550,
          mau_sac_ph53550: listToEdit.mau_sac_ph53550,
          gia_ban_ph53550: listToEdit.gia_ban_ph53550,
          mo_ta_ph53550: listToEdit.mo_ta_ph53550,
          hinh_anh_ph53550: listToEdit.hinh_anh_ph53550
        });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin sách');
        router.back();
      }
    }
  }, [listId, list]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: field === 'gia_ban_ph53550' ? parseFloat(value) || 0 : value
    });
  };

  const handleSubmit = async () => {
    if (!formData.ten_xe_ph53550 || !formData.mau_sac_ph53550 || !formData.gia_ban_ph53550) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin sách');
      return;
    }

    try {
      
      const result = await dispatch(updateListOnAPI(formData));
      if (!result.error) {
        Alert.alert('Thành công', 'Cập nhật sách thành công', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật sách. Vui lòng thử lại!');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật sách');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên sách</Text>
          <CustomInput
            placeholder="Nhập tên sách"
            value={formData.ten_xe_ph53550}
            onChangeText={(text) => handleInputChange('ten_xe_ph53550', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tác giả</Text>
          <CustomInput
            placeholder="Nhập tên tác giả"
            value={formData.mau_sac_ph53550}
            onChangeText={(text) => handleInputChange('mau_sac_ph53550', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Giá bán</Text>
          <CustomInput
            placeholder="Nhập giá bán"
            value={formData.gia_ban_ph53550?.toString()}
            onChangeText={(text) => handleInputChange('gia_ban_ph53550', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mô tả</Text>
          <CustomInput
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
          <Text style={styles.label}>URL Hình ảnh</Text>
          <CustomInput
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