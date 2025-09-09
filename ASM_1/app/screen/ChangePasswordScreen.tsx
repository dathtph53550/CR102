import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useAppDispatch } from '../redux/hooks';
import { changePassword } from '../services/api';
import { useTheme } from '../components/ThemeProvider';

type ChangePasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ChangePasswordScreen'>;

export default function ChangePasswordScreen({ navigation }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, updateUser } = useUser();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để thực hiện chức năng này');
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API để thay đổi mật khẩu
      const success = await changePassword(user.id, currentPassword, newPassword);
      
      if (success) {
        // Cập nhật thông tin người dùng trong context
        if (updateUser) {
          updateUser({
            ...user,
            password: newPassword
          });
        }
        
        Alert.alert(
          'Thành công',
          'Mật khẩu đã được thay đổi thành công',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Lỗi', 'Không thể thay đổi mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color={theme.textColor} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textColor }]}>Đổi Mật Khẩu</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: theme.textColor }]}>Mật khẩu hiện tại</Text>
            <View style={[styles.passwordContainer, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <TextInput
                style={[styles.input, { color: theme.textColor }]}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#7C7C7C"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Feather
                  name={showCurrentPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.textColor}
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.formLabel, { color: theme.textColor }]}>Mật khẩu mới</Text>
            <View style={[styles.passwordContainer, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <TextInput
                style={[styles.input, { color: theme.textColor }]}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#7C7C7C"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Feather
                  name={showNewPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.textColor}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>Xác nhận mật khẩu mới</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Feather
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#7C7C7C"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.changeButtonText}>Đổi Mật Khẩu</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  formContainer: {
    padding: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181725',
    marginBottom: 8,
    marginTop: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#181725',
    backgroundColor: '#F5F5F5',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  changeButton: {
    backgroundColor: '#53B175',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
