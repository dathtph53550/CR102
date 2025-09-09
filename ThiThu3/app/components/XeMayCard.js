import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const XeMayCard = ({ xeMay, onDelete, onEdit }) => {
  const {
    id,
    ten_xe,
    mau_sac,
    gia_ban,
    mo_ta,
    hinh_anh
  } = xeMay;

  const handleEdit = () => {
    onEdit(xeMay);
  };

  return (
    <Animatable.View 
      animation="fadeInUp" 
      duration={800} 
      style={styles.card}
    >
      <Image 
        source={{ uri: hinh_anh }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{ten_xe}</Text>
        <View style={styles.details}>
          <Text style={styles.colorText}>Màu: <Text style={styles.colorValue}>{mau_sac}</Text></Text>
          <Text style={styles.priceText}>{gia_ban?.toLocaleString('vi-VN')} VNĐ</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{mo_ta}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  colorText: {
    fontSize: 14,
    color: '#666',
  },
  colorValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default XeMayCard; 