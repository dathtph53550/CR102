import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  Image
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { Notification } from '../services/api';
import { useUser } from '../context/UserContext';
import { format, formatDistanceToNow } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadNotifications } from '../redux/reducers/notificationReducer';

type NotificationScreenProps = NativeStackScreenProps<RootStackParamList, 'NotificationScreen'>;

export default function NotificationScreen({ navigation }: NotificationScreenProps) {
  const dispatch = useAppDispatch();
  const { notifications, loading: isLoading, error } = useAppSelector((state: any) => state.notifications);
  const { user } = useUser();

  useEffect(() => {
    const userId = user?.id ? String(user.id) : "1";
    dispatch(loadNotifications(userId) as any);
  }, [dispatch, user?.id]);



  const formatNotificationTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationIconContainer}>
        <Feather name="bell" size={24} color="#53B175" />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{formatNotificationTime(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={require('../../assets/images/empty-notification.png')} 
        style={styles.emptyImage}
        defaultSource={require('../../assets/images/empty-notification.png')}
      />
      <Text style={styles.emptyTitle}>Không có thông báo</Text>
      <Text style={styles.emptySubtitle}>Bạn không có thông báo nào</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#53B175" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.notificationList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyNotifications}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationList: {
    padding: 20,
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(83, 177, 117, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#181725',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    tintColor: '#E2E2E2',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 24,
  },
});
