import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Product } from '../types/product';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

export interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'DetailScreen'>;
}

export default function ProductInfo({ product, quantity, onQuantityChange, navigation }: ProductInfoProps) {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#181725" />
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleDecrement}
        >
          <Feather name="minus" size={24} color="#53B175" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleIncrement}
        >
          <Feather name="plus" size={24} color="#53B175" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  productInfo: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#53B175',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7C7C7C',
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  quantityButton: {
    backgroundColor: '#F2F3F2',
    borderRadius: 17,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
}); 