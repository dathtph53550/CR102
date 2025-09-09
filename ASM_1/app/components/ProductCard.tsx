import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Product } from '../types/product';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  DetailScreen: { product: Product };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigation = useNavigation<NavigationProp>();
  const { image_url, name, description, price } = product;

  const handlePress = () => {
    navigation.navigate('DetailScreen', { product });
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={handlePress}>
      <Image source={{ uri: image_url }} style={styles.productImage} />
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productQuantity}>{description}</Text>
      <View style={styles.productBottom}>
        <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: 170,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 15,
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
  addButton: {
    backgroundColor: '#53B175',
    width: 45,
    height: 45,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard; 