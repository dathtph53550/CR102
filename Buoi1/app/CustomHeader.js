import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
const CustomHeader = ({title, onBackPress}) => {
   return (
     <View style={styles.headerContainer}>
       <TouchableOpacity onPress={onBackPress}>
         <Text style={styles.backButtonText}>Back</Text>
       </TouchableOpacity>
       <Text style={styles.headerTitle}>{title}</Text>


     </View>
   );
 };

 const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      height: 60,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#f8f8f8',
      paddingHorizontal: 10,
      elevation: 3,
    },
    backButtonText: {
      color: '#007AFF',
      marginRight: 20,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color:'red'
    },
  });

 export default CustomHeader;
  
