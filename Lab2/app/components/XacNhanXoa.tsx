import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { HoaDon } from './CompoCha';

interface XacNhanXoaProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hoaDon: HoaDon;
}

export const XacNhanXoa = ({ visible, onClose, onConfirm, hoaDon }: XacNhanXoaProps) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Xác nhận xóa</Text>
          
          <Text style={styles.message}>
            Bạn có chắc chắn muốn xóa hóa đơn này?
          </Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#f44336' }]} 
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#9e9e9e' }]} 
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
    marginBottom: 10, 
    textAlign: 'center',
    color: '#f44336'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666'
  },
  infoGroup: { 
    marginBottom: 15 
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
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 10,
    marginTop: 10
  },
  button: {
    flex: 1,
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