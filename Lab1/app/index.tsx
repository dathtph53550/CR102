import { Alert, SafeAreaView, ScrollView, Text, View, Button } from 'react-native'
import React, { useState } from 'react'
import Header from './Components/HeaderPH53550'
import Banner from './Components/BannerPH53550'
import MyBlock from './Components/MyBlockPH53550'
import MyTextInput from './Components/MyTextInputPH53550'
import { MyTheme, useTheme } from './Components/MyThemePH53550'

const App = () => {
  return (
    <MyTheme> 
      <BodyApp />
    </MyTheme>
  )
}

const BodyApp = () => {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [room, setRoom] = useState("")
  const [subject, setSubject] = useState("")
  const [caHoc, setCaHoc] = useState("")
  const [freeTime, setFreeTime] = useState("")
  const [phone, setPhone] = useState("")
  
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#FFF' : '#FFF' }}>
      <ScrollView style={{ paddingBottom: 10 }}>
        <Header title="Trang Chủ" />
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
        </View>

        <Banner url={isDarkMode 
          ? "https://i.pinimg.com/736x/fb/48/87/fb4887b27ae456d6794d01b538f29e07.jpg"
          : "https://i.pinimg.com/736x/84/ad/1c/84ad1c67da7c18049aaa3f71bb3e474b.jpg"} 
        />

        <MyBlock
          title="Giới thiệu"
          titleColor={isDarkMode ? 'red' : 'blue'}
          style={{ backgroundColor: isDarkMode ? '#FFC51B' : '#A9CFF2' }}
          buttonText=""
          onPress={() => Alert.alert('Giới thiệu')}
        >
          <Text style={{ color: isDarkMode ? '#000' : '#FFF' }}>
            Giày sandal là một loại giày được không chỉ các bạn trẻ mà cả những người lớn tuổi ưa thích.
          </Text>
        </MyBlock>

        <MyBlock
          title="Thông tin cá nhân"
          titleColor={isDarkMode ? 'blue' : 'red'}
          style={{ backgroundColor: isDarkMode ? '#FFC51B' : '#A9CFF2' }}
          colorButton={isDarkMode ? '#f47100' : 'yellow'}
          buttonText="Đăng Ký"
          onPress={() => Alert.alert(`Bạn đã đăng ký thành công với Tên: ${name}\nĐịa chỉ: ${address} || ${room}`)}
        >
          <MyTextInput onChangeText={setName} placeholder="Nhập họ tên" label="Họ và Tên" />
          <MyTextInput onChangeText={setAddress} placeholder="Nhập address" label="Địa chỉ" />
          <MyTextInput onChangeText={setRoom} placeholder="Nhập lớp học" label="Lớp học" />
        </MyBlock>

        <MyBlock
          title="Nhập khoá học"
          titleColor={isDarkMode ? '#32CD32' : 'green'}
          style={{ backgroundColor: isDarkMode ? '#FFC51B' : '#A9CFF2' }}
          buttonText="Đăng Ký Khoá"
          onPress={() => Alert.alert(`Bạn đã đăng ký khoá học: ${subject} || ${caHoc} || ${freeTime}`)}
        >
          <MyTextInput onChangeText={setSubject} placeholder="Nhập khoá học" label="Khoá học" />
          <MyTextInput onChangeText={setCaHoc} placeholder="Nhập Ca Học" label="Ca" />
          <MyTextInput onChangeText={setFreeTime} placeholder="Nhập thời gian rảnh" label="Thời gian rảnh" />
        </MyBlock>

        <MyBlock
          title="Nhập Thông tin liên hệ"
          titleColor='#df55f2'
          colorButton='#61d800'
          style={{ backgroundColor: isDarkMode ? '#FFC51B' : '#A9CFF2' }}
          buttonText="Done"
          onPress={() => Alert.alert(`Bạn đã đăng ký SDT: ${phone}`)}
        >
          <MyTextInput onChangeText={setPhone} placeholder="Nhập SĐT" label="Số Điện Thoại" />
        </MyBlock>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App;
