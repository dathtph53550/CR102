import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Card = ({ list, onDelete, onEdit, onViewDetail, index = 0 }) => {
  const {
    id,
    ten_xe_ph53550,
    mau_sac_ph53550,
    gia_ban_ph53550,
    mo_ta_ph53550,
    hinh_anh_ph53550
  } = list;

  const handleEdit = () => {
    onEdit(list);
  };

  const handleViewDetail = () => {
    onViewDetail(list);
  };

  const animations = ['fadeInLeft', 'fadeInRight', 'fadeInUp'];
  const animation = animations[index % animations.length];

  return (
    <Animatable.View 
      animation={animation} 
      duration={800}
      delay={index * 100} 
      style={styles.card}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={handleViewDetail}>
        <View style={styles.row}>
          <Image 
            source={{ uri: hinh_anh_ph53550 }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <View style={styles.details}>
            <Text style={styles.title}>{ten_xe_ph53550}</Text>
            <Text style={styles.authorText}>Màu sắc: {mau_sac_ph53550}</Text>
            <Text style={styles.priceText}>{gia_ban_ph53550?.toLocaleString('vi-VN')} đ</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{mo_ta_ph53550}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        {/* <TouchableOpacity style={styles.viewButton} onPress={handleViewDetail}>
          <Text style={styles.viewButtonText}>Xem chi tiết</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
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
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
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
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Card;