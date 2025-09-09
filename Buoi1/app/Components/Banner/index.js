import { Image, Text, View } from "react-native"
import React from "react"
import style from "./style"

const index = (props)=>{
   return (
       <View style={style.khung}>
           <Image source={{uri: props.url}} style={style.anh} />
           <Text style={style.tieude}>{props.title}</Text>
       </View>
   )
}
export default index
