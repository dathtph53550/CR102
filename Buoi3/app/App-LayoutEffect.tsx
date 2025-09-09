import { View, Text, Button } from 'react-native'
import React, {useState, useMemo, useEffect, useLayoutEffect} from 'react'




const App = () => {
const [so, setSo] = useState(0);
// const tangSo = useMemo ( hàm xử lý , phần phụ thuộc);
useEffect(()=>{
 console.log("render màn hình");
 },[])


useLayoutEffect(()=>{
 console.log("layout effected...");
 }, []);




const tangSo = useMemo ( ()=>{
    console.log("Thay đổi số: ");
    return so +2; // mỗi lần tăng 2 đơn vị
} , [so]); 
// tangSo được tính toán lại khi so bị thay đổi
// nếu không thay đổi, khi render lại màn hình sẽ không gọi lại
return (        
  <View>
    <Text>App useMemo 666666 </Text>
    <Text style={{fontSize:30}}>Số: {so} </Text>
    <Text style={{fontSize:30}}>Số có sử dụng hàm: {tangSo}</Text>
    <Button title='Tăng số' onPress={()=> setSo(so + 5)} />
  </View>
)
}
export default App
