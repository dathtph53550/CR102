import React, { useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import * as Animatable from 'react-native-animatable';

import { fetchXeMayAsync, deleteXeMayAsync } from './redux/xeMaySlice';
import XeMayCard from './components/XeMayCard';
import Banner from './components/Banner';
import CustomButton from './components/CustomButton';

export default function Index() {
  const dispatch = useDispatch();
  const { xeMays, status, error } = useSelector(state => state.xeMay);

  useEffect(() => {
    dispatch(fetchXeMayAsync());
  }, [dispatch]);

  const handleDelete = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa xe máy này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => dispatch(deleteXeMayAsync(id)),
          style: 'destructive',
        },
      ]
    );
  };

  const navigateToAdd = () => {
    router.push('/add');
  };

  if (status === 'loading' && xeMays.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <CustomButton title="Thử lại" onPress={() => dispatch(fetchXeMayAsync())} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF5722" barStyle="light-content" />
      
      <View style={styles.bannerContainer}>
        <Banner />
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Danh sách Xe Máy</Text>
        <CustomButton
          title="+ Thêm Xe Máy"
          onPress={navigateToAdd}
          style={styles.addButton}
        />
      </View>
      
      {xeMays.length === 0 ? (
        <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có xe máy nào</Text>
          <CustomButton title="Thêm xe máy mới" onPress={navigateToAdd} />
        </Animatable.View>
      ) : (
        <FlatList
          data={xeMays}
          renderItem={({ item }) => <XeMayCard xeMay={item} onDelete={handleDelete} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
