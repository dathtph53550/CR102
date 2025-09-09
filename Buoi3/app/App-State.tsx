import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
//Demo useState


const App = () => {
 const [dem,setDem] = useState({title: "Đếm tiền trong túi", soLuong: 0})
//  khoong gan truc tiep: dem = 123;// sai, phai su dung setDem()
 return (
   <View>
     <Text>Demo đếm</Text>
     <Text>Tiêu đề: {dem.title}</Text>
     <Text>Số lượng: {dem.soLuong}</Text>
     <Button title='Tăng giá trị'
       onPress={ ()=>{
         let obj = { title: 'Đã thay đổi giá trị', soLuong : dem.soLuong + 1 }
         setDem( obj ); //ghi đè giá trị của dem bằng đối tượng mới.
       }}
     />
   </View>
 )
}


export default App


const styles = StyleSheet.create({})
