import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'


//B1: Tạo hàm TinhToan để demo xử lý tốn thời gian.
const TinhToan = (num) => {
    console.log('Gọi hàm tính toán ....');
    let res = 0;


    for (let i = 0; i < 1000000000; i++) {
        // chú ý: máy ảo yếu thì cho ít số 0 thôi.
        res += i;
    }
    console.log('Tính toán xong');
    return res + num;
}




const Index = () => {
    const [count, setCount] = useState(0); // không liên quan hàm tính toán
    const [number, setNumber] = useState(0) // có liên quan hàm tính toán

    // không sử dụng memo
    // const val = TinhToan(number);
    // Trường hợp 2: Có sử dụng memo
    const val = useMemo(() => TinhToan(number), [number])
    // in các giá trị ra màn hình

    return (
        <View>
            <Text style={{ fontSize: 20 }}>Kết quả tính: {val}</Text>
            <Text style={{ fontSize: 30, color: 'blue' }}>Count = {count}</Text>
            <Text style={{ fontSize: 30, color: 'red' }}>Number = {number}</Text>


            <Button title='Tăng count' onPress={() => setCount(count + 1)} />
            <Button title='Tăng Number để gọi hàm tính toán'
                onPress={() => setNumber(number + 1)} />


        </View>
    )
}


export default Index


const styles = StyleSheet.create({})
