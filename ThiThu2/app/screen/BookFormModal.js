import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const BookFormModal = ({ visible, onClose, onSubmit, bookData }) => {
  const isEditMode = !!bookData;
  const [book, setBook] = useState({
    name: '',
    author: '',
    price: '',
    description: '',
    image: 'https://via.placeholder.com/150'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bookData) {
      setBook({
        name: bookData.name,
        author: bookData.author,
        price: bookData.price.toString(),
        description: bookData.description,
        image: bookData.image
      });
      setErrors({});
    } else {
      setBook({
        name: '',
        author: '',
        price: '',
        description: '',
        image: 'https://via.placeholder.com/150'
      });
      setErrors({});
    }
  }, [bookData, visible]);

  const validate = () => {
    let tempErrors = {};
    
    if (!book.name) tempErrors.name = 'Vui lòng nhập tên sách';
    if (!book.author) tempErrors.author = 'Vui lòng nhập tên tác giả';
    if (!book.price) tempErrors.price = 'Vui lòng nhập giá sách';
    else if (isNaN(book.price)) tempErrors.price = 'Giá sách phải là số';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const bookToSubmit = {
        ...book,
        price: parseInt(book.price, 10)
      };

      if (isEditMode) {
        // For edit mode, include the id
        bookToSubmit.id = bookData.id;
      }

      onSubmit(bookToSubmit);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <Animatable.View 
          animation="fadeInUp" 
          duration={500}
          style={styles.modalView}
        >
          <Text style={styles.modalTitle}>
            {isEditMode ? 'Sửa Sách' : 'Thêm Sách Mới'}
          </Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <CustomInput
              label="Tên sách"
              placeholder="Nhập tên sách"
              value={book.name}
              onChangeText={(text) => setBook({ ...book, name: text })}
              error={errors.name}
            />

            <CustomInput
              label="Tác giả"
              placeholder="Nhập tên tác giả"
              value={book.author}
              onChangeText={(text) => setBook({ ...book, author: text })}
              error={errors.author}
            />

            <CustomInput
              label="Giá"
              placeholder="Nhập giá sách"
              value={book.price}
              onChangeText={(text) => setBook({ ...book, price: text })}
              keyboardType="numeric"
              error={errors.price}
            />

            <CustomInput
              label="Mô tả"
              placeholder="Nhập mô tả sách"
              value={book.description}
              onChangeText={(text) => setBook({ ...book, description: text })}
              multiline={true}
              numberOfLines={3}
            />

            <CustomInput
              label="Ảnh URL"
              placeholder="Nhập URL hình ảnh"
              value={book.image}
              onChangeText={(text) => setBook({ ...book, image: text })}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Hủy"
              onPress={onClose}
              color="red"
              style={styles.cancelButton}
            />
            <CustomButton
              title={isEditMode ? 'Cập nhật' : 'Thêm'}
              onPress={handleSubmit}
              color="#2196F3"
              style={styles.submitButton}
            />
          </View>
        </Animatable.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF5722'
  },
  scrollView: {
    marginBottom: 10,
    maxHeight: 400
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  cancelButton: {
    width: '90%',
    marginVertical: 0,
  },
  submitButton: {
    width: '90%',
    marginVertical: 0,
  }
});

export default BookFormModal; 