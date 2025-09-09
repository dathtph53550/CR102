import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.location}>
        <Feather name="map-pin" size={20} color="#53B175" />
        <Text style={styles.locationText}>Dhaka, Banassre</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#181725" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search Store"
          placeholderTextColor="#7C7C7C"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '500',
    color: '#181725',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    padding: 16,
    borderRadius: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default Header; 