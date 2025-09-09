import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { HoaDon } from './CompoCha';

interface XemChiTietHoaDonProps {
  visible: boolean;
  onClose: () => void;
  hoaDon: HoaDon;
}

export const XemChiTietHoaDon = ({ visible, onClose, hoaDon }: XemChiTietHoaDonProps) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Chi tiết hóa đơn</Text>
          
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Mã hóa đơn:</Text>
            <Text style={styles.value}>{hoaDon.id}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Khách hàng:</Text>
            <Text style={styles.value}>{hoaDon.khachHang}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Sản phẩm:</Text>
            <Text style={styles.value}>{hoaDon.sanPham}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoGroup, { flex: 1 }]}>
              <Text style={styles.label}>Số lượng:</Text>
              <Text style={styles.value}>{hoaDon.soLuong}</Text>
            </View>

            <View style={[styles.infoGroup, { flex: 1 }]}>
              <Text style={styles.label}>Đơn giá:</Text>
              <Text style={styles.value}>{hoaDon.gia.toLocaleString()} VND</Text>
            </View>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Tổng tiền:</Text>
            <Text style={[styles.value, { color: '#2196F3', fontWeight: 'bold' }]}>
              {(hoaDon.soLuong * hoaDon.gia).toLocaleString()} VND
            </Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={[styles.value, { 
              color: hoaDon.hoanThanh ? '#4CAF50' : '#f44336',
              fontWeight: 'bold'
            }]}>
              {hoaDon.hoanThanh ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Đóng</Text>
          </TouchableOpacity>
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
  infoGroup: { 
    marginBottom: 15 
  },
  infoRow: { 
    flexDirection: 'row', 
    marginBottom: 15,
    gap: 20
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5,
    color: '#666'
  },
  value: { 
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    color: '#333'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  }
}); 