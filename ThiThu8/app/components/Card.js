import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';



const Card = ({ list, onEdit, onViewDetail, index = 0 }) => {
  const {
    id,
    ph53550_hoten,
    ph53550_mon_thi,
    ph53550_ngay_thi,
    ph53550_ca_thi,
    ph53550_hinh_anh
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
          
          <View style={styles.details}>
            <Text style={styles.title}>Họ tên: {ph53550_hoten}</Text>
            <Text style={styles.authorText}>Môn Thi: {ph53550_mon_thi}</Text>
            <Text style={styles.authorText}>Ngày Thi:  {ph53550_ngay_thi}</Text>
            <Text style={styles.priceText}> Ca Thi: {ph53550_ca_thi}</Text>
          </View>
          <Image 
            source={{ uri: ph53550_hinh_anh }} 
            style={styles.image} 
            resizeMode="cover"
          />
        </View>
        {/* <Text style={styles.description} numberOfLines={2}>{mo_ta_ph53550}</Text> */}
      </TouchableOpacity>
      <View style={styles.actions}>
        {/* <TouchableOpacity style={styles.viewButton} onPress={handleViewDetail}>
          <Text style={styles.viewButtonText}>Xem chi tiết</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity> */}
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