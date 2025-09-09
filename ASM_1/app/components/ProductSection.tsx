import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Product } from '../types/product';

export interface ProductSectionProps {
  title: string;
  products: Product[];
  onProductPress: (product: Product) => void;
}

export default function ProductSection({ title, products, onProductPress }: ProductSectionProps) {
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => onProductPress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productUnit}>{item.unit}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
  },
  seeAll: {
    fontSize: 16,
    color: '#53B175',
    fontWeight: '500',
  },
  productList: {
    paddingHorizontal: 20,
  },
  productCard: {
    width: 170,
    marginRight: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181725',
    marginBottom: 5,
  },
  productUnit: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
}); 