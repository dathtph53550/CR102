import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../assets/data/products';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the theme options
export type ThemeType = 'light' | 'dark';

// Define the student information
export interface StudentInfo {
  fullName: string;
  studentId: string;
  className: string;
}

// Define the phone information
export interface PhoneInfo {
  type: string;
  cpu: string;
  ram: string;
  storage: string;
}

// Define the context type
interface AppContextType {
  // Theme
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  
  // Favorites
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Recently viewed
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  
  // Student info
  studentInfo: StudentInfo;
  updateStudentInfo: (info: StudentInfo) => void;
  
  // Phone info
  phoneInfo: PhoneInfo;
  updatePhoneInfo: (info: PhoneInfo) => void;
  
  // Auth
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  // Theme
  theme: 'light',
  setTheme: () => {},
  
  // Favorites
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  
  // Recently viewed
  recentlyViewed: [],
  addToRecentlyViewed: () => {},
  
  // Student info
  studentInfo: {
    fullName: '',
    studentId: '',
    className: ''
  },
  updateStudentInfo: () => {},
  
  // Phone info
  phoneInfo: {
    type: '',
    cpu: '',
    ram: '',
    storage: ''
  },
  updatePhoneInfo: () => {},
  
  // Auth
  isLoggedIn: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Storage keys
const STORAGE_KEYS = {
  THEME: 'app_theme',
  FAVORITES: 'app_favorites',
  RECENTLY_VIEWED: 'app_recently_viewed',
  STUDENT_INFO: 'app_student_info',
  PHONE_INFO: 'app_phone_info',
  IS_LOGGED_IN: 'app_is_logged_in',
  USER_CREDENTIALS: 'app_user_credentials'
};

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [theme, setTheme] = useState<ThemeType>('light');
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    fullName: 'John Doe',
    studentId: 'PH12345',
    className: 'CR102'
  });
  const [phoneInfo, setPhoneInfo] = useState<PhoneInfo>({
    type: 'iPhone 15 Pro',
    cpu: 'A17 Pro',
    ram: '8GB',
    storage: '256GB'
  });

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load theme
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
        
        // Load favorites
        const savedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
        
        // Load recently viewed
        const savedRecentlyViewed = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
        if (savedRecentlyViewed) {
          setRecentlyViewed(JSON.parse(savedRecentlyViewed));
        }
        
        // Load student info
        const savedStudentInfo = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT_INFO);
        if (savedStudentInfo) {
          setStudentInfo(JSON.parse(savedStudentInfo));
        }
        
        // Load phone info
        const savedPhoneInfo = await AsyncStorage.getItem(STORAGE_KEYS.PHONE_INFO);
        if (savedPhoneInfo) {
          setPhoneInfo(JSON.parse(savedPhoneInfo));
        }
        
        // Load login status
        const savedIsLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
        if (savedIsLoggedIn === 'true') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };
    
    loadData();
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Save favorites to storage when they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Save recently viewed to storage when they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Save student info to storage when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.STUDENT_INFO, JSON.stringify(studentInfo));
  }, [studentInfo]);

  // Save phone info to storage when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.PHONE_INFO, JSON.stringify(phoneInfo));
  }, [phoneInfo]);

  // Save login status to storage when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Add to favorites
  const addToFavorites = (product: Product) => {
    if (!favorites.some(item => item.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  // Remove from favorites
  const removeFromFavorites = (productId: string) => {
    setFavorites(favorites.filter(item => item.id !== productId));
  };

  // Check if product is in favorites
  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  // Add to recently viewed
  const addToRecentlyViewed = (product: Product) => {
    // Remove the product if it's already in the list
    const filtered = recentlyViewed.filter(item => item.id !== product.id);
    
    // Add the product to the beginning of the list
    const updated = [product, ...filtered];
    
    // Keep only the 10 most recent items
    setRecentlyViewed(updated.slice(0, 10));
  };

  // Update student info
  const updateStudentInfo = (info: StudentInfo) => {
    setStudentInfo(info);
  };

  // Update phone info
  const updatePhoneInfo = (info: PhoneInfo) => {
    setPhoneInfo(info);
  };

  // Login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would validate credentials against a server
      // For this demo, we'll just check if the user exists in AsyncStorage
      const savedCredentials = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
      
      if (savedCredentials) {
        const credentials = JSON.parse(savedCredentials);
        const user = credentials.find(
          (cred: { username: string; password: string }) => 
            cred.username === username && cred.password === password
        );
        
        if (user) {
          setIsLoggedIn(true);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  // Register
  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would send credentials to a server
      // For this demo, we'll just store them in AsyncStorage
      const savedCredentials = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
      let credentials = savedCredentials ? JSON.parse(savedCredentials) : [];
      
      // Check if username already exists
      if (credentials.some((cred: { username: string }) => cred.username === username)) {
        return false;
      }
      
      // Add new credentials
      credentials.push({ username, password });
      await AsyncStorage.setItem(STORAGE_KEYS.USER_CREDENTIALS, JSON.stringify(credentials));
      
      // Auto login after registration
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setIsLoggedIn(false);
  };

  // Context value
  const contextValue: AppContextType = {
    theme,
    setTheme,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    recentlyViewed,
    addToRecentlyViewed,
    studentInfo,
    updateStudentInfo,
    phoneInfo,
    updatePhoneInfo,
    isLoggedIn,
    login,
    register,
    logout,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export default AppContext;
