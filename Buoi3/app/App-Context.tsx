import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useContext } from 'react'


//1. Tại nơi muốn truyền dữ liệu thì tạo context
const MyContext = createContext({}); // khởi tạo rỗng
// truyền dữ liệu từ cha sang con thì sẽ bao bọc
// phần return của compCha bằng provider


const CompCha = ()=>{
 const dulieu = {
   title: 'Dữ liệu ở cha',
   number: 1234
 }
 return(
   <MyContext.Provider value ={dulieu}>
     <CompCon />
   </MyContext.Provider>
 )
}
const CompCon = ()=>{
   const xx = useContext( MyContext )
   return(
     <View>
       <Text style={{fontSize:20}}>Title = {xx.title}</Text>
       <Text style={{fontSize:20}}>Number = {xx.number}</Text>
     </View>
   );
}
const App = () => { // trong App gọi component cha ra sử dụng
 // có 3 cấp:  App > CompCha > CompCon , App là cao nhất
 return (
   <View>
     <Text>App</Text>
     <CompCha />
   </View>
 )
}


export default App


const styles = StyleSheet.create({})
