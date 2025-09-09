import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import BookScreen from './screen/bookScreen'


const Index = () => {
 return (
   <Provider store={store}>
     <BookScreen />
   </Provider>
 )
}


export default Index
