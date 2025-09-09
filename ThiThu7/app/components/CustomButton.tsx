import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: CustomButtonProps) => {
  const buttonStyle = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    danger: styles.dangerButton,
  };

  const textStyle = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    danger: styles.dangerText,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle[variant],
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#3498db' : 'white'} />
      ) : (
        <Text style={[styles.text, textStyle[variant]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#3498db',
  },
  dangerText: {
    color: 'white',
  },
});

export default CustomButton; 