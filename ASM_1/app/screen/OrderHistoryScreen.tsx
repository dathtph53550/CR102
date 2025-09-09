import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

interface OrderItem {
  image: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
  nameOrder: string;
  addressOrder: string;
  phoneOrder: string;
  order: OrderItem[];
}

const OrderHistoryScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const response = await axios.get(`https://asm-cro102.onrender.com/orders?user_id=${user.id}`);
        // Sort orders by created_at date, newest first
        const responseData = response.data as Order[];
        const sortedOrders = [...responseData];
        sortedOrders.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      return () => {};
    }, [fetchOrders])
  );

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang xử lý':
        return '#FFC107'; // Yellow
      case 'Đang giao hàng':
        return '#2196F3'; // Blue
      case 'Hoàn thành':
        return '#4CAF50'; // Green
      case 'Đã hủy':
        return '#F44336'; // Red
      default:
        return '#757575'; // Grey
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderId === item.id;
    const statusColor = getStatusColor(item.status);

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleOrderExpand(item.id)}
        >
          <View>
            <Text style={styles.orderId}>Mã #{item.id.substring(0, 4)}</Text>
            <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
          </View>
          <View style={styles.orderStatusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Feather
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#757575"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.orderDetails}>
            <View style={styles.orderItems}>
              {item.order.map((orderItem, index) => (
                <View key={index} style={styles.orderItem}>
                  <Image
                    source={{ uri: orderItem.image }}
                    style={styles.productImage}
                    defaultSource={require('../../assets/images/react-logo.png')}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{orderItem.name}</Text>
                    <Text style={styles.productQuantity}>SL: {orderItem.quantity}</Text>
                  </View>
                  <Text style={styles.productPrice}>{orderItem.price.toFixed(3)} đ</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Người nhận:</Text>
                <Text style={styles.summaryValue}>{item.nameOrder}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Địa chỉ:</Text>
                <Text style={styles.summaryValue}>{item.addressOrder}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Số điện thoại:</Text>
                <Text style={styles.summaryValue}>{item.phoneOrder}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Tổng tiền:</Text>
                <Text style={styles.totalValue}>{item.total_price.toFixed(3)} đ</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch Sử Đặt Hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#53B175" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={60} color="#E0E0E0" />
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 20,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  orderDate: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 4,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  orderDetails: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181725',
  },
  productQuantity: {
    fontSize: 13,
    color: '#7C7C7C',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#181725',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  orderSummary: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  summaryValue: {
    fontSize: 14,
    color: '#181725',
    maxWidth: '60%',
    textAlign: 'right',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#53B175',
  },
});

export default OrderHistoryScreen;
