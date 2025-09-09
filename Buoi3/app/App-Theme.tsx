import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MyTheme, useTheme } from './Components/MyTheme'


const Index = () => {
 return (
  <MyTheme>
     {/* Đây là khu vực nội dung của ứng dụng */}
     <BodyApp />
  </MyTheme>
 )
}


const BodyApp = ()=>{
   const {theme, toggleTheme} = useTheme();
   return (
     <View style={[st.khung,  {backgroundColor: theme ==='light'?'yellow':'#000'}    ]}>
         <Text style={{color: theme==='light'?'#000':'#fff',
                       fontSize: theme==='light'?30:50 }}>
           Đây là nội dung văn bản Demo</Text>
        
         <Button title='Đổi giao diện' onPress={toggleTheme} />
     </View>
   )
}


export default Index


const st = StyleSheet.create({
     khung:{ borderWidth: 1, borderColor: 'red'}
})