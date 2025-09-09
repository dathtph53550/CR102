import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const SinhVienCard = ({ sinhVien, onDelete, onEdit }) => {
  const {
    id,
    ph53550_ho_ten,
    ph53550_ma_so,
    ph53550_ngay_sinh,
    ph53550_diem_tb,
    ph53550_lop,
    ph53550_anh_dai_dien
  } = sinhVien;

  const handleEdit = () => {
    onEdit(sinhVien);
  };



  return (
    <Animatable.View 
      animation="fadeInUp" 
      duration={800} 
      style={styles.card}
    >
      <View style={styles.row}>
        <Image 
          source={{ uri: ph53550_anh_dai_dien }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={styles.title}>{ph53550_ho_ten}</Text>
          <Text style={styles.colorText}>Mã: {ph53550_ma_so}</Text>
          <Text style={styles.priceText}>Điểm TB: {ph53550_diem_tb}</Text>
          <Text style={styles.priceText}>Lớp: {ph53550_lop}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>{ph53550_ngay_sinh}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => {
          console.log(id)
          onDelete(id)
        }}>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  colorText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SinhVienCard;
