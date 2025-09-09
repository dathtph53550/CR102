import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const BookCard = ({ book, onDelete, onEdit, index = 0 }) => {
  const {
    id,
    name,
    author,
    price,
    description,
    image
  } = book;

  const handleEdit = () => {
    onEdit(book);
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
      <View style={styles.row}>
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.authorText}>Tác giả: {author}</Text>
          <Text style={styles.priceText}>{price?.toLocaleString('vi-VN')} đ</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      <View style={styles.actions}>
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

export default BookCard; 