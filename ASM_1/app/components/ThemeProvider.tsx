import React, { ReactNode, createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, StatusBar } from 'react-native';
import { toggleThemeMode } from '../redux/actions/themeActions';

// Định nghĩa các màu sắc cho light mode và dark mode
export const lightTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#181725',
  primaryColor: '#53B175',
  secondaryColor: '#F2F3F2',
  cardBackground: '#FFFFFF',
  borderColor: '#E2E2E2',
};

export const darkTheme = {
  backgroundColor: '#121212',
  textColor: '#FFFFFF',
  primaryColor: '#53B175',
  secondaryColor: '#2A2A2A',
  cardBackground: '#1E1E1E',
  borderColor: '#2A2A2A',
};

interface ThemeProviderProps {
  children: ReactNode;
}

type ThemeType = {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
  cardBackground: string;
  borderColor: string;
};

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ 
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);



const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDarkMode } = useSelector((state: any) => state.theme);
  const dispatch = useDispatch();
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    dispatch(toggleThemeMode());
  };
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.backgroundColor}
      />
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemeProvider;
