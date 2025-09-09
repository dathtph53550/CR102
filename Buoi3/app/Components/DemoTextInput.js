import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'


const DemoTextInput = (props) => {
 return (
   <View style={st.khung}>
     <Text style={st.label}>{props.label}</Text>
     <TextInput  {...props}
       style={[props.style, st.input]}
       placeholderTextColor={props.placeholderTextColor || '#000FFF'}
       />
   </View>
 )
}
export default DemoTextInput


const st = StyleSheet.create({
    khung: {padding: 20, backgroundColor: 'pink', margin: 10},
   input:{padding:10, borderWidth: 1, borderColor: 'blue', margin: 5},
   label:{color:'red', fontWeight:'bold', fontSize:15}
})
