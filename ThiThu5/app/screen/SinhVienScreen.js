import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert,Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSinhVien, addSinhVienOnAPI, deleteSinhVien, updateSinhVien } from '../redux/action'
import SinhVienCard from '../components/SinhVienCard'
import CustomButton from '../components/CustomButton'
import AddCarModal from '../components/AddSinhVienModal'

const SinhVienScreen = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editData, setEditData] = useState(null);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const listSinhVien = useSelector((state) => state.listSinhVienInStore.listSinhVien ?? [])

    const dispatch = useDispatch();

    useEffect(() => {
        loadData();
    },[]);

    const loadData = ( ) => {
        setIsRefreshing(true);
        dispatch(fetchSinhVien()).finally(() => setIsRefreshing(false));
    }

    const handleAdd = () => {
        setIsModalVisible(true);
        setEditData(null);
    }

    const handleEdit = (item) => {
        setEditData(item);
        setIsModalVisible(true);
    }

    const handleDelete = (id) => {
        Alert.alert(
            "Xóa sinh viên",
            "Bạn có chắc chắn muốn xóa sinh viên này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => dispatch(deleteSinhVien(id))
                }
            ]
        )
    }





  return (
    <View style={{flexDirection: 'column', padding: 10, alignItems: 'center', height: '100%'}}>
         <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%',alignItems: 'center'}}>
            <Text>SinhVienScreen</Text>
            <CustomButton title="Thêm sinh viên"  onPress={handleAdd}/>
         </View>
         
         <FlatList
            data={listSinhVien}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <SinhVienCard sinhVien = {item} onDelete={handleDelete} onEdit={handleEdit}/>}
            refreshing={isRefreshing}
            onRefresh={loadData}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         />

         <AddCarModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} editData={editData}/>
    </View>

  )
}

export default SinhVienScreen

const styles = StyleSheet.create({

})