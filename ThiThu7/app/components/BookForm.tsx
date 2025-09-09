import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Book } from '../redux/slices/sachSlice';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';

interface BookFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (book: Omit<Book, 'id'> | Book) => void;
  initialBook?: Book | null;
  isLoading?: boolean;
  isEditing?: boolean;
}

const BookForm = ({
  visible,
  onClose,
  onSubmit,
  initialBook = null,
  isLoading = false,
  isEditing = false,
}: BookFormProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.ph56666_ten_sach_22042025);
      setAuthor(initialBook.ph56666_tac_gia_22042025);
      setGenre(initialBook.ph56666_the_loai_22042025);
      setPrice(initialBook.ph56666_gia_sach_22042025.toString());
      setYear(initialBook.ph56666_nam_phat_hanh_22042025.toString());
      setDescription(initialBook.ph56666_mo_ta_22042025);
      setCoverImage(initialBook.ph56666_anh_bia_22042025);
    } else {
      resetForm();
    }
  }, [initialBook, visible]);

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setGenre('');
    setPrice('');
    setYear('');
    setDescription('');
    setCoverImage('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Tên sách không được để trống';
    }
    if (!author.trim()) {
      newErrors.author = 'Tác giả không được để trống';
    }
    if (!genre.trim()) {
      newErrors.genre = 'Thể loại không được để trống';
    }
    if (!price.trim()) {
      newErrors.price = 'Giá sách không được để trống';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Giá sách phải là số dương';
    }
    if (!year.trim()) {
      newErrors.year = 'Năm phát hành không được để trống';
    } else if (
      isNaN(Number(year)) ||
      !Number.isInteger(Number(year)) ||
      Number(year) < 1900 ||
      Number(year) > new Date().getFullYear()
    ) {
      newErrors.year = `Năm phát hành phải là số nguyên từ 1900 đến ${new Date().getFullYear()}`;
    }
    if (!description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }
    if (!coverImage.trim()) {
      newErrors.coverImage = 'URL ảnh bìa không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const bookData = {
        ...(initialBook?.id ? { id: initialBook.id } : {}),
        ph56666_ten_sach_22042025: title,
        ph56666_tac_gia_22042025: author,
        ph56666_the_loai_22042025: genre,
        ph56666_gia_sach_22042025: Number(price),
        ph56666_nam_phat_hanh_22042025: Number(year),
        ph56666_mo_ta_22042025: description,
        ph56666_anh_bia_22042025: coverImage,
      };
      onSubmit(bookData as any);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {isEditing ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.formContainer}>
            <CustomTextInput
              label="Tên sách"
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tên sách"
              error={errors.title}
            />
            <CustomTextInput
              label="Tác giả"
              value={author}
              onChangeText={setAuthor}
              placeholder="Nhập tên tác giả"
              error={errors.author}
            />
            <CustomTextInput
              label="Thể loại"
              value={genre}
              onChangeText={setGenre}
              placeholder="Nhập thể loại"
              error={errors.genre}
            />
            <CustomTextInput
              label="Giá sách"
              value={price}
              onChangeText={setPrice}
              placeholder="Nhập giá sách"
              keyboardType="numeric"
              error={errors.price}
            />
            <CustomTextInput
              label="Năm phát hành"
              value={year}
              onChangeText={setYear}
              placeholder="Nhập năm phát hành"
              keyboardType="numeric"
              error={errors.year}
            />
            <CustomTextInput
              label="Mô tả"
              value={description}
              onChangeText={setDescription}
              placeholder="Nhập mô tả sách"
              multiline
              error={errors.description}
            />
            <CustomTextInput
              label="URL ảnh bìa"
              value={coverImage}
              onChangeText={setCoverImage}
              placeholder="Nhập URL ảnh bìa"
              error={errors.coverImage}
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Hủy"
                onPress={onClose}
                variant="secondary"
              />
              <CustomButton
                title={isEditing ? 'Cập nhật' : 'Thêm mới'}
                onPress={handleSubmit}
                loading={isLoading}
              />
            </View>
          </ScrollView>
        </View>
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
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    lineHeight: 30,
  },
  formContainer: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
});

export default BookForm; 