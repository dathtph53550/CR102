import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { fetchBooks, addBook, updateBook, deleteBook, Book, setSelectedBook } from './redux/slices/sachSlice';
import { AppDispatch } from './redux/store';

import Banner from './components/Banner';
import BookItem from './components/BookItem';
import BookForm from './components/BookForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import FilterSegment from './components/FilterSegment';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { books, status, error } = useSelector((state: RootState) => state.sach);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Mặc định');

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleAddBook = (newBook: Omit<Book, 'id'>) => {
    dispatch(addBook(newBook))
      .then(() => {
        setIsAddModalVisible(false);
      });
  };

  const handleEditBook = (book: Book) => {
    dispatch(setSelectedBook(book));
    setIsEditModalVisible(true);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    dispatch(updateBook(updatedBook))
      .then(() => {
        setIsEditModalVisible(false);
        dispatch(setSelectedBook(null));
      });
  };

  const handleDeleteBook = (id: number) => {
    setBookToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteBook = () => {
    if (bookToDelete !== null) {
      dispatch(deleteBook(bookToDelete))
        .then(() => {
          setIsDeleteModalVisible(false);
          setBookToDelete(null);
        });
    }
  };

  const getUniqueGenres = useCallback(() => {
    const genres = books.map(book => book.ph56666_the_loai_22042025);
    return ['Tất cả', ...Array.from(new Set(genres))];
  }, [books]);

  const filteredBooks = useCallback(() => {
    let result = [...books];

    // Filter by search query (search by title)
    if (searchQuery) {
      result = result.filter(book => 
        book.ph56666_ten_sach_22042025.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== 'Tất cả') {
      result = result.filter(book => book.ph56666_the_loai_22042025 === selectedGenre);
    }

    // Sort books
    if (sortBy === 'Giá tăng dần') {
      result.sort((a, b) => a.ph56666_gia_sach_22042025 - b.ph56666_gia_sach_22042025);
    } else if (sortBy === 'Giá giảm dần') {
      result.sort((a, b) => b.ph56666_gia_sach_22042025 - a.ph56666_gia_sach_22042025);
    }

    return result;
  }, [books, searchQuery, selectedGenre, sortBy]);

  if (status === 'loading' && books.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => dispatch(fetchBooks())}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Banner />
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên sách"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FilterSegment
          label="Thể loại:"
          options={getUniqueGenres()}
          selectedOption={selectedGenre}
          onSelect={setSelectedGenre}
        />
        
        <FilterSegment
          label="Sắp xếp:"
          options={['Mặc định', 'Giá tăng dần', 'Giá giảm dần']}
          selectedOption={sortBy}
          onSelect={setSortBy}
        />
      </View>

      {/* Book list */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.totalText}>
            Tổng số: <Text style={styles.totalCount}>{filteredBooks().length}</Text> sách
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Thêm sách</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredBooks()}
          renderItem={({ item }) => (
            <BookItem
              book={item}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có sách nào</Text>
            </View>
          }
        />
      </View>

      {/* Add Book Modal */}
      <BookForm
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleAddBook}
        isLoading={status === 'loading'}
      />

      {/* Edit Book Modal */}
      <BookForm
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          dispatch(setSelectedBook(null));
        }}
        onSubmit={handleUpdateBook}
        initialBook={useSelector((state: RootState) => state.sach.selectedBook)}
        isLoading={status === 'loading'}
        isEditing
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false);
          setBookToDelete(null);
        }}
        onConfirm={confirmDeleteBook}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa sách này không?"
        isLoading={status === 'loading'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  totalText: {
    fontSize: 16,
    color: '#666',
  },
  totalCount: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
