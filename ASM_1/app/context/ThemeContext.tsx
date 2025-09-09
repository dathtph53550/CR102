import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    card: string;
    border: string;
    notification: string;
  };
};

const lightColors = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#53B175',
  secondary: '#F2F3F2',
  card: '#FFFFFF',
  border: '#E2E2E2',
  notification: '#53B175',
};

const darkColors = {
  background: '#1E1E1E',
  text: '#FFFFFF',
  primary: '#53B175',
  secondary: '#2D2D2D',
  card: '#2D2D2D',
  border: '#404040',
  notification: '#53B175',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setIsDarkMode(parsedUser.theme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = isDarkMode ? 'light' : 'dark';
      setIsDarkMode(!isDarkMode);
      
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const updatedUser = { ...parsedUser, theme: newTheme };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 