// import { SafeAreaView, ScrollView, Text, View } from "react-native";
// import Banner from "./Components/Banner";
// import Gioithieu from "./Components/Home/gioithieu";
// //Create me Screen Login Beautifull

// export default function Index() {
//   return (
//     <SafeAreaView>
//       <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
//         <Banner url="https://images.pexels.com/photos/7100323/pexels-photo-7100323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" title="Em yêu Hoàng Văn" />
//         <Banner url="https://i.pinimg.com/736x/26/1b/86/261b8621d24ad8065927031128202142.jpg" title="Banner so 1" />
//         <Banner url="https://images.pexels.com/photos/2561628/pexels-photo-2561628.jpeg?auto=compress&cs=tinysrgb&w=1200" title="Banner so 2" />
//         <Gioithieu />
//       </ScrollView>
//     </SafeAreaView>
      
      
      
//   );
// }

// import { View, Text, SafeAreaView, Alert, TextInput } from 'react-native'
// import React, { useState } from 'react'
// import CustomHeader from './CustomHeader'
// import DemoSection from './DemoSection'


// const index = () => {


//   const bamNutBack = (title) => {
//     Alert.alert('hhihi ' + title);
//   }

//   return (
//     <SafeAreaView>
//       <Text>App</Text>
//       <CustomHeader title="Tieu de man hinh" onBackPress={() => bamNutBack("0")}/>
//       <CustomHeader title="Tieu de man hinh 1" onBackPress={() => bamNutBack("1")}/>

//       <DemoSection title="Danh sách sản phẩm" 
//                    style={{backgroundColor: 'yellow',margin: 20}}>
//                     <Text>San pham 1</Text>
//                     <Text>San pham 1</Text>
//                     <TextInput placeholder='Nhap van ban'/>

//       </DemoSection>

//       <DemoSection title="Dia chi nhan hang" 
//                    style={{backgroundColor: 'cyan',margin: 10}}>
//                     <Text>Dia chi 1</Text>
//                     <Text>Dia chi 2</Text>
//                     <Text>Dia chi 3</Text>
//                     <TextInput placeholder='Nhap van ban'/>
                    

//       </DemoSection>

//       <DemoSection title=""
//                    style={{backgroundColor: 'white',margin: 10}}>
//                     <Text>Dia chi 1</Text>
//                     <Text>Dia chi 2</Text>
//                     <Text>Dia chi 3</Text>
//                     <TextInput placeholder='Nhap van ban'/>
//       </DemoSection>


//     </SafeAreaView>
//   )
// }

// export default index

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Wrapper from './Components/Wrapper'

const index = () => {
  return (
    <View>
      <Wrapper style={{backgroundColor: 'yellow'}}>
        <Text>Noi dung man hinhf</Text>
      </Wrapper>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})