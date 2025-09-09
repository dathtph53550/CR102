import React, { useState, useCallback, useEffect } from 'react';
import { Button, Text, View } from 'react-native';


const App = () => {
 const [count, setCount] = useState(0);
 /// không đưa vào callback sẽ tạo lại hàm mỗi khi render
//  const increment =() => {
//    console.log("Gọi hàm tăng biến");
//    setCount((prevCount) => prevCount + 1);
//  }


 // cải tiến bằng cách cho vào callback như bên dưới thì effect không gọi lại
const increment = useCallback(() => {
   console.log("Gọi hàm tăng biến");
  
   setCount((prevCount) => prevCount + 1);
 }, []);




 useEffect(() => {
   console.log('Thay đổi hàm tăng biến, tạo lại hàm');
 }, [increment]); // kiểm tra hàm increment có tạo lại hay không


 return (
   <View>
     <Text>Count: {count}</Text>
     <Button onPress={increment} title='Increment'/>
   </View>
 );
};


export default App;
