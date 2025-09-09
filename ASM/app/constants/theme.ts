export const COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  tertiary: '#e74c3c',
  
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6A6A6A',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  
  background: '#F9F9F9',
  card: '#FFFFFF',
  
  success: '#2ecc71',
  error: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
};

export const SIZES = {
  // global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  
  // font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  
  // app dimensions
  width: '100%',
  height: '100%',
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: 'bold' },
  h2: { fontSize: SIZES.h2, fontWeight: 'bold' },
  h3: { fontSize: SIZES.h3, fontWeight: 'bold' },
  h4: { fontSize: SIZES.h4, fontWeight: 'bold' },
  h5: { fontSize: SIZES.h5, fontWeight: 'bold' },
  body1: { fontSize: SIZES.body1 },
  body2: { fontSize: SIZES.body2 },
  body3: { fontSize: SIZES.body3 },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 6,
  },
};

const appTheme = { COLORS, SIZES, FONTS, SHADOWS };

export default appTheme;
