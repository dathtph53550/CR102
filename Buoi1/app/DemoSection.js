import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DemoSection = ({title, children,style}) => {
  return (
    <View style={[st.container,style]}>
        {title && 
        <Text style={st.title}>{title}</Text> 
        }
        <View style={st.content}>
            {children}
        </View>
    </View>
  )
}

export default DemoSection

const st = StyleSheet.create({
    container: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: 'red',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontSize:20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'blue'
    },
    content: {
        padding: 10
    }
})