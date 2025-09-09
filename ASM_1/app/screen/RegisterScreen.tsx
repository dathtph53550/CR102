import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  HomeScreen: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    // Validate inputs
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!validateEmail(email)) {
      setEmailValid(false);
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    } else {
      setEmailValid(true);
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const response = await fetch('https://asm-cro102.onrender.com/users?email=' + email);
      const users = await response.json();

      if (users.length > 0) {
        Alert.alert('Lỗi', 'Email này đã được đăng ký');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        full_name: fullName,
        email: email,
        password: password,
        theme: 'light'
      };

      const createResponse = await fetch('https://asm-cro102.onrender.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (createResponse.ok) {
        Alert.alert(
          'Thành công', 
          'Đăng ký tài khoản thành công!',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Lỗi', 'Không thể đăng ký tài khoản. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/carrot1.png')} 
          style={styles.logo}
        />

        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản để tiếp tục</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Vui lòng nhập họ và tên"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.emailContainer}>
              <TextInput
                style={[styles.input, styles.emailInput, !emailValid && styles.inputError]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailValid(true);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Vui lòng nhập email"
              />
              {email.length > 0 && emailValid && (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#53B175" />
                </View>
              )}
              {email.length > 0 && !emailValid && (
                <View style={styles.checkIcon}>
                  <Ionicons name="close-circle" size={24} color="#FF4B4B" />
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="• • • • • • • •"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="#53B175"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.termsText}>
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Text style={styles.termsLink}>Điều khoản dịch vụ</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Chính sách bảo mật</Text>.
          </Text>

          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.disabledButton]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    flex: 1,
  },
  checkIcon: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
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
  termsText: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#53B175',
  },
  signUpButton: {
    backgroundColor: '#53B175',
    padding: 24,
    borderRadius: 19,
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#181725',
    fontSize: 14,
  },
  loginLink: {
    color: '#53B175',
    fontSize: 14,
    fontWeight: '600',
  },
  inputError: {
    borderBottomColor: '#FF4B4B',
  },
  disabledButton: {
    opacity: 0.7,
  },
});