import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';

const MyBlock = ({ title, titleColor = 'blue', colorButton='#2196F3', children, style, buttonText, onPress }) => {
  return (
    <View style={[st.container, style]}>

      {title && <Text style={[st.title,{color: titleColor}]}>{title}</Text>}
      
      <View style={st.content}>{children}</View>

      {buttonText && (
        <View style={[st.buttonContainer,{backgroundColor:colorButton}]}>
          <Button style={{fontSize: 15}} title={buttonText} onPress={onPress} color="black" />
        </View>
      )}
    </View>
  );
};

export default MyBlock;

const st = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#A9CFF2',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    margin: 17,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'blue',
  },
  content: {
    padding: 10,
  },
  buttonContainer: {
    width: '40%',
    height: 50,
    backgroundColor: "#2196F3",
    borderRadius: 10, 
    borderWidth: 1,
    borderColor: "#000", 
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'flex-end'
  },
});
