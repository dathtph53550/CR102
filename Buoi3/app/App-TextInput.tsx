import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import DemoTextInput from './Components/DemoTextInput'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Index = () => {
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");

  return (
    <GestureHandlerRootView>  {/* Thêm GestureHandlerRootView ở đây */}
      <View >
        <Text>App</Text>
        <DemoTextInput onChangeText={setHoTen} placeholder="Nhập vào họ tên" label="Họ và Tên" />
        <DemoTextInput onChangeText={setEmail} placeholder="Nhập vào email" label="Email" />
        <Text style={{ fontSize: 30 }}>
          Bạn vừa nhập: {hoTen} || {email}
        </Text>
      </View>
    </GestureHandlerRootView>
  );
}

export default Index;

const styles = StyleSheet.create({
  
});
