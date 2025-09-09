import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';

const ModalDetail = ({ visible, item, onClose }) => {
  if (!item) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animatable.View 
          animation="zoomIn" 
          duration={400} 
          style={styles.modalView}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {item.hinh_anh_ph53550 && (
              <Image 
                source={{ uri: item.hinh_anh_ph53550 }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Tên xe:</Text>
                <Text style={styles.value}>{item.ten_xe_ph53550}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>Màu sắc:</Text>
                <Text style={styles.value}>{item.mau_sac_ph53550}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>Giá bán:</Text>
                <Text style={styles.value}>{item.gia_ban_ph53550?.toLocaleString('vi-VN')} VNĐ</Text>
              </View>
              
              <View style={styles.descriptionContainer}>
                <Text style={styles.label}>Mô tả:</Text>
                <Text style={styles.description}>{item.mo_ta_ph53550 || 'Không có mô tả'}</Text>
              </View>
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  scrollView: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#555',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#3498db',
    marginTop: 5,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    width: '35%',
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  descriptionContainer: {
    justifyContent: 'center',
    marginTop: 5,
  },
  description: {
    marginTop: 5,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default ModalDetail; 