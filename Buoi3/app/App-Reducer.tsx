import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useReducer } from 'react'

interface State {
  giaTri: number;
}

type Action = 
  | { type: 'TANG' }
  | { type: 'GIAM' };

const index = () => {
   const demoReducer = (state: State, action: Action) => {
      switch(action.type){
         case 'TANG': return {giaTri: state.giaTri + 1};
         case 'GIAM': return {giaTri: state.giaTri - 1};
         default: return state;
      }
   }

   const [state, dispatch] = useReducer(demoReducer, {giaTri: 0});

  return (
    <View>
      <Text style={{fontSize: 30}}>Giá trị đếm: {state.giaTri}</Text>
      <Button title='Tang' onPress={() => dispatch({type:'TANG'})}/>
      <Button title='GIAM' onPress={() => dispatch({type:'GIAM'})}/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})