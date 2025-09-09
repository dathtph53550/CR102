import { ActivityIndicator, StyleSheet, Text, View, FlatList, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooks, deleteBookOnAPI, addBookOnAPI, updateBookOnAPI } from '../redux/action'
import BookFormModal from './BookFormModal'
import Banner from '../components/Banner'
import BookCard from '../components/BookCard'
import CustomButton from '../components/CustomButton'
import * as Animatable from 'react-native-animatable'

const BookScreen = () => {
   const [loading, setLoading] = useState(true);
   const [modalVisible, setModalVisible] = useState(false);
   const [selectedBook, setSelectedBook] = useState(null);
   
   const listBook = useSelector(state => state.listBookInStore?.listBook || []);
   
   const dispatch = useDispatch();

   const handleDelete = async (id) => {
     Alert.alert(
       "Xác nhận xóa",
       "Bạn có chắc chắn muốn xóa sách này?",
       [
         {
           text: "Hủy",
           style: "cancel"
         },
         { 
           text: "Xóa", 
           onPress: () => {
             dispatch(deleteBookOnAPI(id))
               .then(res => {
                 if (!res.error) {
                   Alert.alert("Thành công", "Xóa sách thành công!");
                 } else {
                   Alert.alert("Lỗi", "Không thể xóa sách. Vui lòng thử lại!");
                 }
               });
           },
           style: "destructive"
         }
       ]
     );
   };

   const handleEdit = (book) => {
     setSelectedBook(book);
     setModalVisible(true);
   };

   const handleAdd = () => {
     setSelectedBook(null); 
     setModalVisible(true);
   };

   const handleFormSubmit = (bookData) => {
     if (bookData.id) {
       dispatch(updateBookOnAPI(bookData))
         .then(res => {
           if (!res.error) {
             Alert.alert("Thành công", "Cập nhật sách thành công!");
             setModalVisible(false);
           } else {
             Alert.alert("Lỗi", "Không thể cập nhật sách. Vui lòng thử lại!");
           }
         });
     } else {
       dispatch(addBookOnAPI(bookData))
         .then(res => {
           if (!res.error) {
             Alert.alert("Thành công", "Thêm sách mới thành công!");
             setModalVisible(false);
           } else {
             Alert.alert("Lỗi", "Không thể thêm sách. Vui lòng thử lại!");
           }
         });
     }
   };

   useEffect(() => {
       console.log('Component mounted, fetching books...');
       const fetchData = async () => {
           try {
               await dispatch(fetchBooks());
               setLoading(false);
           } catch (error) {
               console.error('Error fetching books:', error);
               setLoading(false);
           }
       };
       fetchData();
   }, [dispatch]); 

   if(loading || listBook.length === 0){
       return <ActivityIndicator size='large' color='blue' />
   }

   const renderBookItem = ({ item, index }) => (
     <BookCard 
       book={item} 
       onEdit={handleEdit} 
       onDelete={handleDelete}
       index={index}
     />
   );

   return (
       <View style={styles.container}>
        <View style={{width: '100%', height: 200}}>
          <Banner />
        </View>

         <Animatable.View 
           animation="fadeInDown" 
           duration={800} 
           style={styles.header}
         >
           <Text style={styles.headerTitle}>Danh sách sách</Text>
           <CustomButton 
             title="+ Thêm sách" 
             onPress={handleAdd} 
             color="green"
             style={styles.addButton}
           />
         </Animatable.View>
         
         <FlatList
           data={listBook}
           keyExtractor={(item) => item.id.toString()}
           renderItem={renderBookItem}
           contentContainerStyle={styles.listContainer}
           showsVerticalScrollIndicator={false}
         />
         
         <BookFormModal 
           visible={modalVisible}
           onClose={() => setModalVisible(false)}
           onSubmit={handleFormSubmit}
           bookData={selectedBook}
         />
       </View>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginVertical: 0,
  },
  listContainer: {
    paddingBottom: 20,
  }
});

export default BookScreen;
