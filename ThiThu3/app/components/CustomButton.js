import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  type = 'primary', 
  color = '#FF5722',
  textColor,
  icon = null,
  disabled = false 
}) => {
  // Determine button style based on type and color
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Add type style
    if (type === 'primary') {
      buttonStyle.push(styles.primaryButton);
    } else if (type === 'secondary') {
      buttonStyle.push(styles.secondaryButton);
    }
    
    // Add color style if it's a predefined color
    if (color === 'red') {
      buttonStyle.push(styles.redButton);
    } else if (color === 'green') {
      buttonStyle.push(styles.greenButton);
    } else if (color !== 'primary' && color !== 'secondary') {
      // Nếu là màu tùy chỉnh (không phải predefined)
      buttonStyle.push({ backgroundColor: color });
    }
    
    // Add disabled style
    if (disabled) {
      buttonStyle.push(styles.disabledButton);
    }
    
    // Add custom style
    if (style) {
      buttonStyle.push(style);
    }
    
    return buttonStyle;
  };

  // Determine text style based on type and color
  const getTextStyle = () => {
    let textStyle = [styles.buttonText];
    
    if (type === 'primary') {
      textStyle.push(styles.primaryText);
    } else if (type === 'secondary') {
      textStyle.push(styles.secondaryText);
    }
    
    if (color === 'red') {
      textStyle.push(styles.redText);
    } else if (color === 'green') {
      textStyle.push(styles.greenText);
    }

    if (disabled) {
      textStyle.push(styles.disabledText);
    }
    
    // Màu text tùy chỉnh
    if (textColor) {
      textStyle.push({ color: textColor });
    } else if (color !== 'primary' && color !== 'secondary' && color !== 'red' && color !== 'green') {
      // Nếu là màu nền tùy chỉnh và không có màu text, text mặc định là trắng
      textStyle.push({ color: 'white' });
    }
    
    return textStyle;
  };

  return (
    <Animatable.View 
      animation="pulse" 
      duration={1000}
      iterationCount={1}
    >
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text 
            style={getTextStyle()}
            numberOfLines={1}
            ellipsizeMode="tail"
            allowFontScaling={false}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    minHeight: Platform.OS === 'android' ? 48 : 44,
  },
  primaryButton: {
    backgroundColor: '#FF5722',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  redButton: {
    backgroundColor: '#F44336',
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    marginHorizontal: 10,
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center',
      }
    }),
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#FF5722',
  },
  redText: {
    color: 'white',
  },
  greenText: {
    color: 'white',
  },
  disabledText: {
    color: '#888888',
  }
});

export default CustomButton; 