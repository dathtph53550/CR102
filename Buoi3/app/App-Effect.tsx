import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const index = () => {
   const [dataa, setData] = useState(null);

//    useEffect(() => {
//       fetch('https://67ac54545853dfff53da3089.mockapi.io/users')
//           .then(response => response.json())
//           .then(data => setData(data));
//   }, []);

const getList = async () => {
   console.log("Bat dau goi API LAY DU Lieu");
   try{
      const res = await fetch('https://67ac54545853dfff53da3089.mockapi.io/users');
      console.log('Da lay xong du lieu tu server');
      console.log('===> chuyen ve json');
      const arrJson = await res.json();
      console.log('Da chuyen xong ve mang json, luu vao state');
      setData(arrJson);
      console.log('----------- Ket thuc lay du lieu --------')
   }catch(error){
      console.log(error);
   }
} //Het ham lay du leiu
// b3 su dung
useEffect( () => {
   getList();
   console.log(dataa)
   console.log('***********************')
},[]);
return (
   <View>
      <Text></Text>
      {dataa == null ? (
      <View>
         <Text style={{fontSize: 30, color: 'red'}}>Đang tải ............</Text>
         <ActivityIndicator size="large" color="blue"/>
      </View>
      ) : (
      <FlatList
         data={dataa}
         keyExtractor={(item) => item.id}
         renderItem={({item}) =>
         <View>   
               <Text>{item.id} --- {item.username} </Text>
               <Image source={{uri: item.avatar}}
                        width={100} height={100} />
         </View>  
            }
      />
      )}
   </View>
)
}

export default index

const styles = StyleSheet.create({})