// src/screens/AccountScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Switch, Modal, Alert } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import MenuItem from '../components/MenuItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/reducers/themeReducer';

type RootStackParamList = {
  MyDetailScreen: undefined;
  AboutScreen: undefined;
  OrderHistoryScreen: undefined;
  ChangePasswordScreen: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const AccountScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: any) => state.theme);
  const { theme } = useTheme();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    // Thực hiện các hành động đăng xuất ở đây
    // Ví dụ: xóa token, đặt lại trạng thái người dùng, v.v.
    setLogoutModalVisible(false);
    // Điều hướng về màn hình đăng nhập
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.name}>Nguyen Van A</Text>
            <Text style={styles.email}>hoangdat07082005@gmail.com</Text>
          </View>
          <TouchableOpacity>
          </TouchableOpacity>
        </View>
        <MenuItem title="Thông Tin Cá Nhân" iconName="user"  onPress={() => navigation.navigate('MyDetailScreen')}/>
        <MenuItem title="Lịch Sử Đặt Hàng" iconName="shopping-bag" onPress={() => navigation.navigate('OrderHistoryScreen')} />
        <MenuItem title="Đổi Mật Khẩu" iconName="lock" onPress={() => navigation.navigate('ChangePasswordScreen')} />
        <MenuItem title="Khác" iconName="info-circle" onPress={() => navigation.navigate('AboutScreen')}/>
        <View style={[styles.themeContainer, { backgroundColor: theme.secondaryColor }]}>
          <Text style={[styles.themeText, { color: theme.textColor }]}>Đổi giao diện</Text>
          <Switch 
            value={isDarkMode} 
            onValueChange={handleToggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? theme.primaryColor : '#f4f3f4'}
          />
        </View>

       

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>Bạn có muốn đăng xuất không?</Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutModalButton]} 
                onPress={confirmLogout}
              >
                <Text style={styles.logoutModalButtonText}>Đăng Xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  edit: {
    fontSize: 20,
    marginLeft: 'auto',
    color: '#00A86B',
  },
  logoutButton: {
    backgroundColor: '#53B175',
    padding: 15,
    margin: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF9FF',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
  },
  themeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#7C7C7C',
    fontWeight: '600',
  },
  logoutModalButton: {
    backgroundColor: 'white',
  },
  logoutModalButtonText: {
    fontSize: 16,
    color: '#53B175',
    fontWeight: '600',
  },
});

export default AccountScreen;
