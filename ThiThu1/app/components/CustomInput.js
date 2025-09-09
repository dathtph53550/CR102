import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error = null,
}) => {
  return (
    <Animatable.View 
      animation="fadeInUp" 
      duration={500} 
      style={styles.container}
    >
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.multilineInput,
          error && styles.errorInput
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput; 