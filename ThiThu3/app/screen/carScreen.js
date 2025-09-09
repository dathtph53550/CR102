import { StyleSheet, Text, View, FlatList, Image, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCar, deleteCar } from '../redux/action'
import XeMayCard from '../components/XeMayCard'
import Banner from '../components/Banner'
import AddCarModal from '../components/AddCarModal'
import CustomButton from '../components/CustomButton'
import * as Animatable from 'react-native-animatable'

const carScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editData, setEditData] = useState(null);
    const listCar = useSelector(state => state.listCarInStore.listCar ||[])
    const dispatch = useDispatch()

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        setIsRefreshing(true);
        dispatch(fetchCar())
            .finally(() => setIsRefreshing(false));
    }

    const handleDelete = (id) => {
        dispatch(deleteCar(id))
    }

    const handleCloseModal = () => {
        setModalVisible(false);
        setEditData(null);
        // Reload data after adding or updating a car
        loadData();
    }

    const handleAddNew = () => {
        setEditData(null);
        setModalVisible(true);
    }

    const handleEdit = (carData) => {
        setEditData(carData);
        setModalVisible(true);
    }

  return (
    <View style={styles.container}>
        <View style={styles.bannerWrapper}>
            <Animatable.View 
                style={styles.bannerContainer}
                animation="fadeIn"
                duration={1000}
            >
                <Banner />
            </Animatable.View>
        </View>
      
        <Animatable.View 
            style={styles.header}
            animation="slideInDown"
            duration={800}
        >
            <Text style={styles.title}>Danh Sách Xe</Text>
             
            <CustomButton title="+ Thêm Xe Mới" onPress={handleAddNew}/>
        </Animatable.View>

        <FlatList
            data={listCar}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                <XeMayCard 
                    xeMay={item} 
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
            contentContainerStyle={styles.listContainer}
            refreshing={isRefreshing}
            onRefresh={loadData}
            showsVerticalScrollIndicator={false}
        />

        <AddCarModal 
            visible={modalVisible}
            onClose={handleCloseModal}
            editData={editData}
        />
    </View>
  )
}

const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
      },
      bannerWrapper: {
        height: 200,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: '#f0f0f0',
      },
      bannerContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        ...Platform.select({
          android: {
            elevation: 4,
          },
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }
        }),
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 8,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
      },
      listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
      },
})

export default carScreen

