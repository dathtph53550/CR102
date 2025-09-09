import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../app/src1/redux/store/index'
import TodoScreen from '../app/src1/screen/TodoScreen'
/*
Tạo API trên mockapi có các thuộc tính:
{
title: "title 1",
status: false,
id: "1"
},
*/
const App = () => {
return (
 <Provider store={store}>
  <TodoScreen />
 </Provider>
)
}
export default App
   const styles = StyleSheet.create({})
