import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';

// Sample Data for FlatList
const quizData = [
  {
    id: '1',
    category: 'Product Design',
    title: 'Design System',
    questions: 10,
    author: 'Brandon',
    authorImage: require('../../assets/images/favicon.png'),
  },
  {
    id: '2',
    category: 'Development',
    title: 'React Native 101',
    questions: 16,
    author: 'Jennifer',
    authorImage: require('../../assets/images/favicon.png'),
  },
  {
    id: '3',
    category: 'Project Management',
    title: 'Agile Basics',
    questions: 21,
    author: 'Eva',
    authorImage: require('../../assets/images/favicon.png'),
  },
  ...Array.from({ length: 17 }).map((_, index) => ({
    id: (index + 4).toString(),
    category: ['Product Design', 'Development', 'Project Management', 'UX Research'][index % 4],
    title: `Quiz Item ${index + 4}`,
    questions: Math.floor(Math.random() * 20) + 5,
    author: ['Brandon', 'Jennifer', 'Eva', 'Mike'][index % 4],
    authorImage: require('../../assets/images/favicon.png'),
  })),
];

const HEADER_MAX_HEIGHT = 200; // Chiều cao ban đầu của header
const HEADER_MIN_HEIGHT = 100; // Chiều cao khi thu nhỏ
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT; // Khoảng cách scroll để hoàn thành animation
const AVATAR_MAX_SIZE = 60;
const AVATAR_MIN_SIZE = 0; // Sẽ biến mất hoàn toàn

// Component chính của Bài 3
const Bai3 = () => {
  // SharedValue để lưu vị trí cuộn
  const scrollY = useSharedValue(0);

  // Scroll handler để cập nhật scrollY
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Style động cho container của header với spring effect
  const headerAnimatedStyle = useAnimatedStyle(() => {
    // Nội suy chiều cao header dựa trên vị trí cuộn
    const height = interpolate(
      scrollY.value,
      [30, SCROLL_DISTANCE], // Input range: từ 0 đến khoảng cách scroll tối đa
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], // Output range: từ chiều cao max đến min
      Extrapolate.CLAMP // Giữ giá trị trong khoảng min/max
    );
    return {
      height: withSpring(height, { damping: 20, stiffness: 90 }),
      backgroundColor: '#4CBB17', // Màu xanh lá như trong hình mẫu
    };
  });

  // Style động cho nội dung bên trong header (avatar, text) để làm mờ dần
  const headerContentAnimatedStyle = useAnimatedStyle(() => {
    // Nội suy opacity dựa trên vị trí cuộn
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 1.5], // Mờ nhanh hơn khi cuộn
      [1, 0], // Từ 1 (rõ) về 0 (mờ)
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -10],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: withSpring(opacity, { damping: 13 }),
      transform: [{ translateY: withSpring(translateY, { damping: 15 }) }],
    };
  });

  // Style động riêng cho Avatar để thu nhỏ và mờ dần
  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 1.5],
      [1, 0.1], // Thu nhỏ gần như biến mất
      Extrapolate.CLAMP
    );
    
    const size = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 1.5],
      [AVATAR_MAX_SIZE, AVATAR_MIN_SIZE],
      Extrapolate.CLAMP
    );
    
    const borderRadius = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 1.5],
      [AVATAR_MAX_SIZE / 2, 0],
      Extrapolate.CLAMP
    );
    
    return {
      width: withSpring(size, { damping: 12 }),
      height: withSpring(size, { damping: 12 }),
      borderRadius: withSpring(borderRadius, { damping: 12 }),
      transform: [{ scale: withSpring(scale, { damping: 12 }) }],
    };
  });


  // Style cho category tabs
  const tabsContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
      [120, 0],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: withSpring(opacity, { damping: 15 }),
      transform: [{ translateY: withSpring(translateY, { damping: 15 }) }],
    };
  });

  // Render item cho FlatList
  const renderItem = ({ item }: { item: { id: string, category: string, title: string, questions: number, author: string, authorImage: any } }) => (
    <View style={styles.listItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <View style={styles.questionBadge}>
          <Text style={styles.questionCount}>Q: {item.questions}</Text>
        </View>
      </View>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <View style={styles.authorContainer}>
        <Image source={item.authorImage} style={styles.authorImage} />
        <Text style={styles.authorName}>{item.author}</Text>
      </View>
    </View>
  );

  // Header component cho FlatList
  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>Popular Quizes</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.containerEx3}>
      {/* Header màu xanh */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        {/* Container cho nội dung header để áp dụng opacity */}
        <Animated.View style={[styles.headerContent, headerContentAnimatedStyle]}>
          {/* Avatar */}
          <View style={{flexDirection: 'row'}}>
              <Animated.Image
                source={require('../../assets/images/favicon.png')}
                style={[styles.avatar, avatarAnimatedStyle]}
              />
              {/* Text trong header */}
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Mornin' Mark!</Text>
                <Text style={styles.headerSubtitle}>Ready for a quiz?</Text>
              </View>
          </View>
          <View style={{flexDirection: 'row',marginTop: 20, marginBottom: -20}}>
            <TouchableOpacity style={[styles.tabButton, styles.tabActive]}>
              <Text style={styles.tabActiveText}>Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton}>
              <Text style={styles.tabText}>Product Design</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton}>
              <Text style={styles.tabText}>Development</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton}>
              <Text style={styles.tabText}>Project</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Category tabs hiện khi header thu nhỏ */}
        <Animated.View style={[styles.tabsContainer, tabsContainerStyle]}>
          <TouchableOpacity style={[styles.tabButton, styles.tabActive]}>
            <Text style={styles.tabActiveText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabText}>Product Design</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabText}>Development</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabText}>Project</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>


      {/* Sử dụng Animated.FlatList */}
      <Animated.FlatList
        data={quizData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingTop: 144}}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles cho Bài 2
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  itemContainer: {
    height: 80,
    width: '90%',
    backgroundColor: '#ADD8E6', // Light blue
    marginBottom: 15,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Styles cho Bài 3
  containerEx3: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Nền xám nhạt cho phần list
  },
  header: {
    position: 'absolute', // Để header nằm trên FlatList
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CBB17', // Màu xanh header
    overflow: 'hidden', // Ẩn nội dung bị tràn khi thu nhỏ
    zIndex: 999, // Đảm bảo header nằm trên
    justifyContent: 'space-between', // Căn nội dung giữa các phần tử
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    position: 'absolute', // Để dễ dàng căn chỉnh khi header thay đổi chiều cao
    bottom: 30, // Căn nội dung ở dưới cùng của header
    left: 15,
    paddingRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#fff', // Màu nền tạm thời nếu ảnh chưa load
  },
  headerTextContainer: {
    flex: 1, // Để text chiếm phần còn lại
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    paddingHorizontal: 15,
    paddingBottom: 3,
    width: '100%',
    overflow: 'scroll',
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  tabActiveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  listHeader: {
    backgroundColor: '#fff', // Nền trắng cho header của list
    padding: 15,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemCategory: {
    fontSize: 12,
    color: '#888',
  },
  questionBadge: {
    backgroundColor: '#5956E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 15,
  },
  questionCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  authorName: {
    fontSize: 12,
    color: '#888',
  },
});

// export default Exercise2; // Hoặc
export default Bai3;