import { StyleSheet, Text, View, Image, Platform } from 'react-native'
import React from 'react'
import * as Animatable from 'react-native-animatable'

const Banner = () => {
  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="fadeInUp" 
        duration={1000} 
        style={styles.imageContainer}
      >
        <Animatable.Image 
          animation="pulse" 
          duration={1500} 
          iterationCount="infinite"
          source={{uri: "https://i.pinimg.com/474x/7f/7b/26/7f7b263902b508192465fe11a373c083.jpg"}} 
          style={styles.image} 
          resizeMode="cover"
        />
      </Animatable.View>
    </View>
  )
}

export default Banner

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        ...Platform.select({
            android: {
                overflow: 'hidden',
            }
        }),
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: Platform.OS === 'ios' ? 10 : 0,
    }
})