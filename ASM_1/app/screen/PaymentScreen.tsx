import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  const { cartItems, totalAmount } = route.params as { cartItems: any[], totalAmount: string };
  
  const [name, setName] = useState(user?.full_name || '');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    // Validate fields
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên người nhận');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    // Process payment
    setIsProcessing(true);
    
    try {
      // Create order
      const orderData = {
        user_id: user?.id,
        total_price: parseFloat(totalAmount),
        status: "Đang xử lý",
        created_at: new Date().toISOString(),
        nameOrder: name,
        addressOrder: address,
        phoneOrder: phone,
        order: cartItems.map(item => ({
          image: item.image,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      // Save order to database
      await axios.post('https://asm-cro102.onrender.com/orders', orderData);
      
      // Create notification for successful order
      const notificationData = {
        user_id: user?.id,
        message: "Bạn đã đặt hàng thành công !!",
        created_at: new Date().toISOString()
      };
      await axios.post('https://asm-cro102.onrender.com/notification', notificationData);
      
      // Clear cart items
      if (user?.id) {
        const userCartItems = await axios.get(`https://asm-cro102.onrender.com/cart?user_id=${user.id}`);
        const cartData = userCartItems.data as Array<{id: string | number}>;
        for (const item of cartData) {
          await axios.delete(`https://asm-cro102.onrender.com/cart/${item.id}`);
        }
      }
      
      // Navigate to success screen
      navigation.navigate('SuccessScreen' as never);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xử lý thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh Toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered ({cartItems.length})</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.itemImage} 
                defaultSource={require('../../assets/images/react-logo.png')}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                <Text style={styles.itemQuantity}>Giá: {item.price.toFixed(3)} đ</Text>
              </View>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(3)} đ</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin người nhận</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tên người nhận"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="SĐT"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Địa Chỉ"
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng Tiền</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Giá hàng đã mua:</Text>
            <Text style={styles.totalValue}>${totalAmount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Số lượng sản phẩm:</Text>
            <Text style={styles.totalValue}>{cartItems.reduce((total, item) => total + item.quantity, 0)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.grandTotalLabel}>Tổng Tiền:</Text>
            <Text style={styles.grandTotalValue}>${totalAmount}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.paymentButtonText}>Thanh Toán Ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#181725',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#7C7C7C',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#53B175',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#181725',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  totalValue: {
    fontSize: 14,
    color: '#181725',
    fontWeight: '500',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 10,
    paddingTop: 15,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#53B175',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  paymentButton: {
    backgroundColor: '#53B175',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
