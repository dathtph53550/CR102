import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const CustomButton = ({ title, onPress, style, type = 'primary' }) => {
  return (
    <Animatable.View animation="bounce" duration={1500}>
      <TouchableOpacity
        style={[
          styles.button,
          type === 'primary' ? styles.primaryButton : styles.secondaryButton,
          style
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          type === 'primary' ? styles.primaryText : styles.secondaryText
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#FF5722',
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#FF5722',
  },
});

export default CustomButton; 