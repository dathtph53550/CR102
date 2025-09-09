import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

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

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Order[]>('https://asm-cro102.onrender.com/orders');
      const sortedOrders = [...response.data];
      sortedOrders.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateStatus = (order: Order, newStatus: string) => {
    Alert.alert(
      'Cập nhật trạng thái',
      `Xác nhận cập nhật trạng thái đơn hàng #${order.id.substring(0, 4)} thành "${newStatus}"?`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Cập nhật',
          onPress: async () => {
            try {
              await axios.patch(`https://asm-cro102.onrender.com/orders/${order.id}`, {
                status: newStatus
              });
              
              setOrders(orders.map(o => {
                if (o.id === order.id) {
                  return { ...o, status: newStatus };
                }
                return o;
              }));
              
              Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng');
            } catch (error) {
              console.error('Error updating order status:', error);
              Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
            }
          }
        }
      ]
    );
  };

  const renderStatusOptions = (order: Order) => {
    const statuses = ['Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'];
    return (
      <View style={styles.statusOptions}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusOption,
              { backgroundColor: getStatusColor(status) },
              order.status === status && styles.currentStatusOption
            ]}
            onPress={() => handleUpdateStatus(order, status)}
            disabled={order.status === status}
          >
            <Text style={styles.statusOptionText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Người đặt:</Text>
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
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng tiền:</Text>
                <Text style={styles.summaryValue}>{item.total_price.toFixed(3)} đ</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Số sản phẩm:</Text>
                <Text style={styles.summaryValue}>{item.order.length}</Text>
              </View>
            </View>

            <Text style={styles.statusChangeTitle}>Thay đổi trạng thái:</Text>
            {renderStatusOptions(item)}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản Lý Đặt Hàng</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  orderSummary: {
    marginBottom: 16,
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
    fontWeight: '500',
  },
  statusChangeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#181725',
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  currentStatusOption: {
    borderWidth: 2,
    borderColor: '#000',
  },
  statusOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default OrderManagement;
