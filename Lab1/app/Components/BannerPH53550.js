import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'

const Banner = (props) => {
  return (
    <View style={styles.khung}>
        <Image source={{uri: props.url}} style={styles.anh} />
    </View>
  )
}

export default Banner

const styles = StyleSheet.create({
    khung: {
        padding: 20,
    },
    anh: {
        width: '100%',
        height: 200,
        borderRadius: 20
    }
})