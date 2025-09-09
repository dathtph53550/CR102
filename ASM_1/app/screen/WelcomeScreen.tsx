import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'WelcomeScreen'>;

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/delivery-man.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/carrot.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.bottomContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>to our store</Text>
              <Text style={styles.description}>Get your groceries in as fast as one hour</Text>
            </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: width * 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 500,
  },
  logo: {
    width: width * 0.12,
    height: width * 0.12,
    tintColor: 'white',
  },
  bottomContent: {
    marginBottom: height * 0.05,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: height * 0.035,
  },
  title: {
    fontSize: width * 0.12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: width * 0.12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: height * 0.02,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  description: {
    fontSize: width * 0.042,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
    letterSpacing: 0.3,
    lineHeight: width * 0.06,
  },
  button: {
    backgroundColor: '#53B175',
    paddingVertical: height * 0.022,
    borderRadius: width * 0.05,
    marginHorizontal: width * 0.02,
    shadowColor: '#53B175',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
}); 