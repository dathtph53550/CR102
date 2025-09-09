// src/components/MenuItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Dùng icon phù hợp
import { useTheme } from './ThemeProvider';

interface MenuItemProps {
  title: string;
  iconName: string;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, iconName, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.container, { 
        borderBottomColor: theme.borderColor,
        backgroundColor: theme.cardBackground
      }]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={20} color={theme.textColor} />
      </View>
      <Text style={[styles.title, { color: theme.textColor }]}>{title}</Text>
      <Icon name="chevron-right" size={16} color={theme.textColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});

export default MenuItem;
