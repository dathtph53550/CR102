import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const SuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Automatically navigate back to home after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' as never }],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color="#53B175" />
        </View>
        
        <Text style={styles.title}>Đặt hàng thành công!</Text>
        <Text style={styles.message}>
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
        </Text>
        
        <Image 
          source={require('../../assets/images/suc.jpg')} 
          style={styles.image}
          defaultSource={require('../../assets/images/react-logo.png')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SuccessScreen;
