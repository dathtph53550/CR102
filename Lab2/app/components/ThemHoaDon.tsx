import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { HoaDonContext, HoaDon } from './CompoCha';

interface ThemHoaDonProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemHoaDon = ({ visible, onClose }: ThemHoaDonProps) => {
  const { themHoaDon } = useContext(HoaDonContext);
  const [open, setOpen] = useState(false);
  const [hoaDonMoi, setHoaDonMoi] = useState<Omit<HoaDon, 'id'>>({
    khachHang: '',
    sanPham: '',
    soLuong: 0,
    gia: 0,
    hoanThanh: false
  });
  const [value, setValue] = useState(false);
  const [items] = useState([
    { label: 'Đã hoàn thành', value: true },
    { label: 'Chưa hoàn thành', value: false }
  ]);

  const resetForm = () => {
    setHoaDonMoi({
      khachHang: '',
      sanPham: '',
      soLuong: 0,
      gia: 0,
      hoanThanh: false
    });
    setValue(false);
  };

  const handleThem = () => {
    if (!hoaDonMoi.khachHang || !hoaDonMoi.sanPham) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    themHoaDon(hoaDonMoi);
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { maxHeight: '90%' }]}>
          <Text style={styles.modalHeader}>Thêm hóa đơn mới</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Khách hàng:</Text>
            <TextInput 
              value={hoaDonMoi.khachHang}
              onChangeText={(text) => setHoaDonMoi({...hoaDonMoi, khachHang: text})}
              style={styles.formInput}
              placeholder="Nhập tên khách hàng"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Sản phẩm:</Text>
            <TextInput 
              value={hoaDonMoi.sanPham}
              onChangeText={(text) => setHoaDonMoi({...hoaDonMoi, sanPham: text})}
              style={styles.formInput}
              placeholder="Nhập tên sản phẩm"
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.formLabel}>Số lượng:</Text>
              <TextInput 
                value={hoaDonMoi.soLuong.toString()}
                onChangeText={(text) => setHoaDonMoi({...hoaDonMoi, soLuong: parseInt(text) || 0})}
                keyboardType="numeric"
                style={styles.formInput}
                placeholder="0"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>Đơn giá:</Text>
              <TextInput 
                value={hoaDonMoi.gia.toString()}
                onChangeText={(text) => setHoaDonMoi({...hoaDonMoi, gia: parseInt(text) || 0})}
                keyboardType="numeric"
                style={styles.formInput}
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tổng tiền:</Text>
            <Text style={styles.formValue}>{(hoaDonMoi.soLuong * hoaDonMoi.gia).toLocaleString()} VND</Text>
          </View>
          
          <View style={[styles.formGroup, { zIndex: 1000 }]}>
            <Text style={styles.formLabel}>Trạng thái:</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={(val) => {
                if (typeof val === 'function') {
                  const newValue = val(value);
                  setValue(newValue);
                  setHoaDonMoi(item => ({ ...item, hoanThanh: newValue }));
                } else {
                  setValue(val);
                  setHoaDonMoi(item => ({ ...item, hoanThanh: val }));
                }
              }}
              zIndex={1000}
              style={styles.formDropdown}
              dropDownContainerStyle={styles.formDropdownContainer}
            />
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#4CAF50', flex: 1 }]} 
              onPress={handleThem}
            >
              <Text style={styles.buttonText}>Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#9e9e9e', flex: 1 }]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    width: '80%' 
  },
  modalHeader: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  formGroup: { 
    marginBottom: 15 
  },
  formRow: { 
    flexDirection: 'row', 
    marginBottom: 15 
  },
  formLabel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5,
    color: '#333'
  },
  formValue: { 
    fontSize: 16, 
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5
  },
  formInput: { 
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white'
  },
  formDropdown: {
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: 'white'
  },
  formDropdownContainer: {
    borderColor: '#ddd',
    backgroundColor: 'white'
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 10 
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  }
}); 