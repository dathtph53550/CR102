import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  WelcomeScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('WelcomeScreen');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo1.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
  },
});

export default SplashScreen;