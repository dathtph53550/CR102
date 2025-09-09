import { StyleSheet, Text, View, Image, Platform, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Animatable from 'react-native-animatable'
import * as ImagePicker from 'expo-image-picker'

const Banner = () => {
  const [imageUri, setImageUri] = useState("https://i.pinimg.com/474x/7f/7b/26/7f7b263902b508192465fe11a373c083.jpg")
  
  useEffect(() => {
    (async () => {
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
      
      if (mediaLibraryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera and media library permissions to make this work!')
      }
    })()
  }, [])

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled) {
        setImageUri(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error picking image', error.message)
    }
  }

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled) {
        setImageUri(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error taking photo', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={pickImage}
        onLongPress={takePhoto}
        delayLongPress={500}
      >
        <Animatable.View 
          animation="fadeInUp" 
          duration={1000} 
          style={styles.animatedContainer}
        >
          <Animatable.Image 
            animation="pulse" 
            duration={1500} 
            iterationCount="infinite"
            source={{uri: imageUri}}
            style={styles.image}
            resizeMode="contain"
          />
        </Animatable.View>
        <Text style={styles.helpText}>Chọn để thêm ảnh • Giữ để thêm ảnh</Text>
      </TouchableOpacity>
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
        width: '95%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedContainer: {
        width: '100%',
        height: '90%',
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
    },
    helpText: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    }
})