// src/screens/PhoneInfoScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PhoneInfoScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Thông Tin Điện Thoại</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Loại điện thoại:</Text>
        <Text style={styles.value}>iPhone 14 Pro Max</Text>

        <Text style={styles.label}>CPU:</Text>
        <Text style={styles.value}>Apple A16 Bionic</Text>

        <Text style={styles.label}>RAM:</Text>
        <Text style={styles.value}>6GB</Text>

        <Text style={styles.label}>Bộ nhớ trong:</Text>
        <Text style={styles.value}>128GB</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 50, 
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});

export default PhoneInfoScreen;
