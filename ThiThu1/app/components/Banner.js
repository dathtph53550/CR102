import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const Banner = () => {
  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="fadeIn" 
        duration={1500} 
        style={styles.bannerContainer}
      >
        <Animatable.Image
          animation="pulse"
          iterationCount="infinite"
          duration={3000}
          source={{ uri: 'https://i.pinimg.com/736x/7f/7b/26/7f7b263902b508192465fe11a373c083.jpg' }}
          style={styles.banner}
        />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 180,
    marginBottom: 10,
  },
  bannerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Banner; 