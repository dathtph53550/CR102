import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const Banner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ứng dụng quản lý sách</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 80,
    backgroundColor: '#4e86de',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Banner; 