import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';

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
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const toggleSecureEntry = () => setIsSecureVisible(!isSecureVisible);

  return (
    <Animatable.View 
      animation="fadeInUp" 
      duration={500} 
      style={styles.container}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        multiline && styles.multilineInputContainer,
        isFocused && styles.focusedInput,
        error && styles.errorInput
      ]}>
        <TextInput
          style={[
            styles.input, 
            multiline && styles.multilineInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.secureToggle}>
            <MaterialIcons 
              name={isSecureVisible ? "visibility" : "visibility-off"} 
              size={22} 
              color="#777" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error ? (
        <Animatable.Text 
          style={styles.errorText}
          animation="shake"
          duration={500}
        >
          {error}
        </Animatable.Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  multilineInputContainer: {
    minHeight: 100,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  focusedInput: {
    borderColor: '#FF5722',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  secureToggle: {
    padding: 10,
  }
});

export default CustomInput; 