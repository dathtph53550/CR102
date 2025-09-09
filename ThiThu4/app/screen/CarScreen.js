import { FlatList, StyleSheet, Text, View,TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { fetchCar } from '../redux/action';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import XeMayCard from '../components/XeMayCard';
import Banner from '../components/Banner';
import CustomButton from '../components/CustomButton';
import AddCarModal from '../components/AddCarModal';
import { deleteCar, updateCar , addCar} from '../redux/action';

const CarScreen = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const listCar = useSelector((state) => state.listCarInStore?.listCar ?? []);


    const dispatch = useDispatch();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsRefreshing(true);
        dispatch(fetchCar())
            .finally(() => setIsRefreshing(false));
    }

    const handleDelete = (id) => {
        dispatch(deleteCar(id))
    }

    const handleAddCar = () => {
        setEditData(null);
        setIsModalVisible(true);
    }

    const handleEdit = (item) => {
        setEditData(item);
        setIsModalVisible(true);
    }

  return (
    <View style={{flexDirection: 'column', padding: 10, alignItems: 'center',height: "100%"}}>
      <View style={{height: 250, backgroundColor: 'gray', borderRadius: 10, marginBottom: 10, width: "100%"}}>
        <Banner />
      </View>
      <View style={{width: "100%", flexDirection: 'row', justifyContent: 'space-between',height: 60, alignItems: 'center',marginBottom: 10}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Danh Sách Xe Máy</Text>
        <CustomButton style={{width: 200, height: 40,fontSize: 16, fontWeight: 'bold',}} title="Thêm Xe Máy" onPress={handleAddCar}/>
      </View>
      <FlatList
        style={{width: "100%",height: "100%"}}
        data={listCar}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <XeMayCard xeMay={item} onDelete={handleDelete}  onEdit={handleEdit}/>}
        refreshing={isRefreshing}
        onRefresh={loadData}
        showsVerticalScrollIndicator={false}
      />
      <AddCarModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} editData={editData}/>
    </View>
  )
}

export default CarScreen

const styles = StyleSheet.create({})