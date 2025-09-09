import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../services/api';
import { Product } from '../types/product';
import { useUser } from '../context/UserContext';
import { useTheme } from '../components/ThemeProvider';

type RootStackParamList = {
  Login: undefined;
  HomeScreen: { user?: { id: number; full_name: string; email: string; } };
  DetailScreen: { 
    product: Product; 
    user: { id: number; full_name: string; email: string; } 
  };
  Register: undefined;
  AdminScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login: userLogin } = useUser();
  const { theme, isDarkMode } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      // Kiểm tra nếu là tài khoản admin
      if (email === 'admin' && password === 'admin') {
        // Chuyển hướng đến màn hình AdminScreen
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate('AdminScreen');
        }, 1000);
        return;
      }
      
      const user = await login(email, password);
      if (user) {
        // Use the UserContext to store user data
        await userLogin(user);
        navigation.navigate('HomeScreen', {});
      } else {
        Alert.alert('Lỗi', 'Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      // console.error('Login error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/carrot1.png')} 
          style={styles.logo}
        />

        <Text style={[styles.title, { color: theme.textColor }]}>Đăng nhập</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#999' : '#7C7C7C' }]}>Nhập email và mật khẩu</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDarkMode ? '#999' : '#7C7C7C' }]}>Email</Text>
            <TextInput
              style={[styles.input, { color: theme.textColor, borderBottomColor: isDarkMode ? '#444' : '#E2E2E2' }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Vui lòng nhập email "
              placeholderTextColor={isDarkMode ? '#666' : '#BDBDBD'}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDarkMode ? '#999' : '#7C7C7C' }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, { color: theme.textColor, borderBottomColor: isDarkMode ? '#444' : '#E2E2E2' }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="• • • • • • • •"
                placeholderTextColor={isDarkMode ? '#666' : '#BDBDBD'}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="#53B175"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: isDarkMode ? '#999' : '#181725' }]}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: isDarkMode ? '#999' : '#7C7C7C' }]}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.adminHint}>
            <Text style={[styles.adminHintText, { color: isDarkMode ? '#666' : '#BDBDBD' }]}>Admin login: email="admin", password="admin"</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  logo: {
    width: 48,
    height: 56,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  input: {
    fontSize: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#181725',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#53B175',
    padding: 24,
    borderRadius: 19,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#181725',
    fontSize: 14,
  },
  signupLink: {
    color: '#53B175',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  adminHint: {
    marginTop: 20,
    alignItems: 'center',
  },
  adminHintText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
