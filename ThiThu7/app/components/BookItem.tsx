import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Book } from '../redux/slices/sachSlice';

interface BookItemProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

const BookItem = ({ book, onEdit, onDelete }: BookItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{book.ph56666_ten_sach_22042025}</Text>
        <Text style={styles.author}>Tác giả: {book.ph56666_tac_gia_22042025}</Text>
        <Text style={styles.genre}>Thể loại: {book.ph56666_the_loai_22042025}</Text>
        <Text style={styles.price}>Giá: {book.ph56666_gia_sach_22042025.toLocaleString('vi-VN')} VND</Text>
        <Text style={styles.year}>Năm: {book.ph56666_nam_phat_hanh_22042025}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: book.ph56666_anh_bia_22042025 || 'https://via.placeholder.com/100' }} 
          style={styles.image} 
          defaultSource={require('../../assets/images/favicon.png')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => onEdit(book)}
        >
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={() => onDelete(book.id)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 3,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  genre: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  year: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#4caf50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookItem; 