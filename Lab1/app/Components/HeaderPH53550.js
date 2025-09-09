import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from './MyThemePH53550' 

const Header = (props) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.khung, { backgroundColor: theme === 'light' ? '#A9CFF2' : '#FFC51B' }]}>
      <Image style={styles.icon} source={require('../../assets/images/home_black.png')}/>

      <Text style={[styles.tieude, { color: theme === 'light' ? '#000' : '#000' }]}>
        {props.title}
      </Text>

      <TouchableOpacity onPress={toggleTheme}>
        <Image  
          style={styles.icon} 
          source={theme === 'light' 
            ? require('../../assets/images/off.png')  
            : require('../../assets/images/on.png')   
          } 
        />
      </TouchableOpacity>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    khung: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 18,
    },  
    tieude: {
        fontWeight: '700',
        fontSize: 28
    },
    icon: {
        width: 30,
        height: 30,
    }
})
