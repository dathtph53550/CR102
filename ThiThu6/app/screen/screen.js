import { ActivityIndicator, StyleSheet, Text, View, FlatList, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchList, deleteListOnAPI } from '../redux/action'
import Banner from '../componets/Banner'
import Card from '../componets/Card'
import CustomButton from '../componets/CustomButton'
import ModalDetail from '../componets/ModalDetail'
import * as Animatable from 'react-native-animatable'
import { router } from 'expo-router'

const BookScreen = () => {
   const [loading, setLoading] = useState(true);
   const [modalVisible, setModalVisible] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);

   const list = useSelector(state => state.listInStore?.list || []);
   const dispatch = useDispatch();

   const handleEdit = (list) => {
    router.push({
      pathname: "edit",
      params: { id: list.id }
    });
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa sách này?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          onPress: () => {
            dispatch(deleteListOnAPI(id))
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

  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleAdd = () => {
    router.push("add");
  };

   useEffect(() => {
       const fetchData = async () => {
           try {
               await dispatch(fetchList());
               setLoading(false);
           } catch (error) {
               console.error('Error fetching books:', error);
               setLoading(false);
           }
       };
       fetchData();
   }, [dispatch]); 

   if(loading || list.length === 0){
       return <ActivityIndicator size='large' color='blue' />
   }

   const renderList = ({ item, index }) => (
     <Card 
       list={item} 
       onEdit={handleEdit} 
       onDelete={handleDelete}
       onViewDetail={handleViewDetail}
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
             title="Thêm sách" 
             onPress={handleAdd} 
             color="green"
             style={styles.addButton}
           />
         </Animatable.View>
         
         <FlatList
           data={list}
           keyExtractor={(item) => item.id.toString()}
           renderItem={renderList}
           contentContainerStyle={styles.listContainer}
           showsVerticalScrollIndicator={false}
         />

         <ModalDetail
           visible={modalVisible}
           item={selectedItem}
           onClose={() => setModalVisible(false)}
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
    marginVertical: 10,
    width: 180,
  },
  listContainer: {
    paddingBottom: 20,
  }
});

export default BookScreen;