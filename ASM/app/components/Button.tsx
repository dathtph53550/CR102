import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  // Determine button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  // Determine button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determine text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSize(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? COLORS.primary : COLORS.white} 
        />
      ) : (
        <Text 
          style={[
            styles.text,
            getTextStyle(),
            getTextSize(),
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...FONTS.body2,
    fontWeight: '600',
  },
  // Variants
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlineText: {
    color: COLORS.primary,
  },
  // Sizes
  smallButton: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base * 2,
  },
  smallText: {
    ...FONTS.body3,
  },
  mediumButton: {
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.base * 3,
  },
  mediumText: {
    ...FONTS.body2,
  },
  largeButton: {
    paddingVertical: SIZES.base * 2,
    paddingHorizontal: SIZES.base * 4,
  },
  largeText: {
    ...FONTS.body1,
  },
  // States
  disabledButton: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray,
  },
  disabledText: {
    color: COLORS.lightGray,
  },
});

export default Button;
