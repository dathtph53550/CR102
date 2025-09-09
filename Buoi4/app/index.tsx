import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, Platform, Alert, StatusBar } from "react-native";
import { useState, useRef, useEffect } from 'react';
import { Video, ResizeMode, Audio } from 'expo-av';
import * as Linking from 'expo-linking';

// Định nghĩa kiểu dữ liệu cho video
type VideoItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: any;
  videoUrl: any; // Sử dụng 'any' để cho phép cả string và require
  isLocal?: boolean;
  views: number;
  likes: number;
  dislikes?: number;
  channel?: string;
  channelIcon?: any;
  subscribers?: number;
  uploadDate: string;
  comments?: CommentItem[];
};

// Định nghĩa kiểu dữ liệu cho bình luận
type CommentItem = {
  id: string;
  user: string;
  userIcon: any;
  comment: string;
  likes: number;
  time: string;
  replies?: CommentItem[];
};

// Dữ liệu mẫu
const videoData: VideoItem[] = [
  {
    id: '1',
    title: 'Video 1 - Hướng dẫn React Native',
    description: 'Hướng dẫn cơ bản về React Native cho người mới bắt đầu. Tìm hiểu về các component, state, props, hooks và những kiến thức cơ bản khác trong React Native.',
    thumbnail: require('../assets/images/icon.png'),
    videoUrl: require('../assets/images/video1.mov'),
    isLocal: true,
    views: 1000,
    likes: 50,
    dislikes: 5,
    channel: 'React Native Channel',
    channelIcon: require('../assets/images/react-logo.png'),
    subscribers: 10000,
    uploadDate: '2024-03-20',
    comments: [
      {
        id: 'c1',
        user: 'User 1',
        userIcon: require('../assets/images/favicon.png'),
        comment: 'Video rất hay, cảm ơn bạn đã chia sẻ!',
        likes: 5,
        time: '2 ngày trước'
      },
      {
        id: 'c2',
        user: 'User 2',
        userIcon: require('../assets/images/favicon.png'),
        comment: 'Tôi đã học được rất nhiều từ video này',
        likes: 3,
        time: '1 tuần trước'
      }
    ]
  },
  {
    id: '2',
    title: 'Video 2 - Lập trình TypeScript',
    description: 'Học TypeScript từ cơ bản đến nâng cao. Khóa học này sẽ giúp bạn hiểu về kiểu dữ liệu, interfaces, generics, type assertions và nhiều khái niệm khác trong TypeScript.',
    thumbnail: require('../assets/images/react-logo.png'),
    videoUrl: require('../assets/images/video3.mov'),
    isLocal: true,
    views: 2000,
    likes: 100,
    dislikes: 8,
    channel: 'TypeScript Channel',
    channelIcon: require('../assets/images/splash-icon.png'),
    subscribers: 20000,
    uploadDate: '2024-03-21',
    comments: [
      {
        id: 'c3',
        user: 'User 3',
        userIcon: require('../assets/images/favicon.png'),
        comment: 'Tuyệt vời, đúng những gì tôi cần!',
        likes: 10,
        time: '5 ngày trước'
      }
    ]
  },
  {
    id: '3',
    title: 'Video 3 - Demo Video MP4',
    description: 'Video demo thử nghiệm định dạng MP4 trong ứng dụng React Native. Video này minh họa cách phát video cục bộ trong ứng dụng di động.',
    thumbnail: require('../assets/images/splash-icon.png'),
    videoUrl: require('../assets/images/video1.mov'),
    isLocal: true,
    views: 500,
    likes: 30,
    dislikes: 2,
    channel: 'Demo Channel',
    channelIcon: require('../assets/images/icon.png'),
    subscribers: 5000,
    uploadDate: '2024-03-25'
  }
];

export default function Index() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  // Khởi tạo Audio khi component mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error("Không thể khởi tạo âm thanh:", error);
      }
    };

    setupAudio();
  }, []);

  // Đặt lại trạng thái tương tác khi chọn video
  useEffect(() => {
    if (selectedVideo) {
      setIsLiked(false);
      setIsDisliked(false);
      setIsSubscribed(false);
    }
  }, [selectedVideo]);

  // Xử lý khi người dùng chọn video
  const handleVideoSelect = async (video: VideoItem) => {
    setSelectedVideo(video);
    
    // Nếu là video local, chuẩn bị phát với âm thanh
    if (video.isLocal && videoRef.current) {
      try {
        // Đặt lại status của video
        setTimeout(async () => {
          if (videoRef.current) {
            await (videoRef.current as any).unloadAsync();
            await (videoRef.current as any).loadAsync(video.videoUrl, {}, false);
            await (videoRef.current as any).playAsync();
          }
        }, 100);
      } catch (error) {
        console.error("Lỗi khi phát video:", error);
      }
    }
  };

  // Định dạng số lượt xem
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  // Mở video YouTube bằng ứng dụng mặc định
  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
  };

  // Render thanh công cụ phía dưới
  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.bottomTab} onPress={() => setActiveTab('home')}>
        <Text style={[styles.tabIcon, activeTab === 'home' ? styles.activeTabIcon : {}]}>🏠</Text>
        <Text style={[styles.tabText, activeTab === 'home' ? styles.activeTabText : {}]}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomTab} onPress={() => setActiveTab('shorts')}>
        <Text style={[styles.tabIcon, activeTab === 'shorts' ? styles.activeTabIcon : {}]}>📱</Text>
        <Text style={[styles.tabText, activeTab === 'shorts' ? styles.activeTabText : {}]}>Shorts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomTab}>
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomTab} onPress={() => setActiveTab('subscriptions')}>
        <Text style={[styles.tabIcon, activeTab === 'subscriptions' ? styles.activeTabIcon : {}]}>📺</Text>
        <Text style={[styles.tabText, activeTab === 'subscriptions' ? styles.activeTabText : {}]}>Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomTab} onPress={() => setActiveTab('library')}>
        <Text style={[styles.tabIcon, activeTab === 'library' ? styles.activeTabIcon : {}]}>📚</Text>
        <Text style={[styles.tabText, activeTab === 'library' ? styles.activeTabText : {}]}>Thư viện</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {selectedVideo ? (
        <View style={styles.videoContainer}>
          {selectedVideo.isLocal ? (
            // Phát video cục bộ trực tiếp trong ứng dụng
            <Video
              ref={videoRef}
              style={styles.video}
              source={selectedVideo.videoUrl}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={true}
              isMuted={false}
              volume={1.0}
              onPlaybackStatusUpdate={status => setStatus(() => status)}
              onError={(error) => {
                console.error("Lỗi video:", error);
                Alert.alert("Lỗi", "Không thể phát video. Lỗi: " + JSON.stringify(error));
              }}
            />
          ) : (
            // Hiển thị thumbnail cho video YouTube với nút play
            <TouchableOpacity
              style={styles.videoPreview}
              onPress={() => openYouTubeVideo(selectedVideo.videoUrl as string)}
            >
              <Image
                source={typeof selectedVideo.thumbnail === 'string' 
                  ? { uri: selectedVideo.thumbnail } 
                  : selectedVideo.thumbnail}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.infoScrollView}>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{selectedVideo.title}</Text>
              <Text style={styles.stats}>
                {formatViews(selectedVideo.views)} lượt xem • {selectedVideo.uploadDate}
              </Text>
              
              {/* Thanh công cụ video */}
              <View style={styles.videoActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => { setIsLiked(!isLiked); setIsDisliked(false); }}
                >
                  <Text style={styles.actionIcon}>{isLiked ? '👍' : '👍'}</Text>
                  <Text style={[styles.actionText, isLiked ? styles.activeActionText : {}]}>
                    {selectedVideo.likes}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => { setIsDisliked(!isDisliked); setIsLiked(false); }}
                >
                  <Text style={styles.actionIcon}>{isDisliked ? '👎' : '👎'}</Text>
                  <Text style={[styles.actionText, isDisliked ? styles.activeActionText : {}]}>
                    Không thích
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>↪️</Text>
                  <Text style={styles.actionText}>Chia sẻ</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>⬇️</Text>
                  <Text style={styles.actionText}>Tải xuống</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>💾</Text>
                  <Text style={styles.actionText}>Lưu</Text>
                </TouchableOpacity>
              </View>
              
              {/* Thông tin kênh */}
              <View style={styles.channelContainer}>
                <Image 
                  source={selectedVideo.channelIcon} 
                  style={styles.channelIcon}
                />
                <View style={styles.channelInfo}>
                  <Text style={styles.channelName}>{selectedVideo.channel}</Text>
                  <Text style={styles.subscriberCount}>
                    {selectedVideo.subscribers ? formatViews(selectedVideo.subscribers) : '0'} người đăng ký
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.subscribeButton, isSubscribed ? styles.subscribedButton : {}]}
                  onPress={() => setIsSubscribed(!isSubscribed)}
                >
                  <Text style={[styles.subscribeText, isSubscribed ? styles.subscribedText : {}]}>
                    {isSubscribed ? 'Đã đăng ký' : 'Đăng ký'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Mô tả video */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{selectedVideo.description}</Text>
              </View>
              
              {/* Phần bình luận */}
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>
                  Bình luận ({selectedVideo.comments ? selectedVideo.comments.length : '0'})
                </Text>
                <Text style={styles.commentsIcon}>▼</Text>
              </View>
              
              {selectedVideo.comments && selectedVideo.comments.map(comment => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image source={comment.userIcon} style={styles.commentUserIcon} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{comment.user}</Text>
                      <Text style={styles.commentTime}>{comment.time}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                    <View style={styles.commentActions}>
                      <Text style={styles.commentLikes}>👍 {comment.likes}</Text>
                      <Text style={styles.commentLikes}>👎</Text>
                      <Text style={styles.commentReply}>Trả lời</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedVideo(null)}
          >
            <Text style={styles.backButtonText}>Quay lại danh sách</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {/* Header giống YouTube */}
          <View style={styles.header}>
            <Image source={require('../assets/images/icon.png')} style={styles.youtubeLogo} />
            <Text style={styles.youtubeText}>YouTube</Text>
            <View style={styles.headerActions}>
              <Text style={styles.headerIcon}>🔔</Text>
              <Text style={styles.headerIcon}>🔍</Text>
              <Image source={require('../assets/images/favicon.png')} style={styles.userIcon} />
            </View>
          </View>
          
          {/* Danh sách video */}
          <ScrollView style={styles.videoList}>
            {videoData.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.videoItem}
                onPress={() => handleVideoSelect(video)}
              >
                <View style={styles.thumbnailContainer}>
                  <Image 
                    source={typeof video.thumbnail === 'string' 
                      ? { uri: video.thumbnail } 
                      : video.thumbnail}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.videoDuration}>
                    <Text style={styles.durationText}>3:45</Text>
                  </View>
                </View>
                
                <View style={styles.videoInfoRow}>
                  <Image 
                    source={video.channelIcon} 
                    style={styles.videoChannelIcon}
                  />
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                    <Text style={styles.videoStats}>
                      {video.channel} • {formatViews(video.views)} lượt xem • {video.uploadDate}
                    </Text>
                  </View>
                  <Text style={styles.videoOptionsIcon}>⋮</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Thanh công cụ phía dưới giống YouTube */}
          {renderBottomBar()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  youtubeLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  youtubeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginLeft: 20,
  },
  userIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 20,
  },
  videoContainer: {
    flex: 1,
  },
  videoPreview: {
    width: Dimensions.get('window').width,
    height: 220,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: 'white',
    fontSize: 30,
    marginLeft: 5, // Để biểu tượng ▶ căn giữa tốt hơn
  },
  video: {
    width: Dimensions.get('window').width,
    height: 220,
  },
  infoScrollView: {
    flex: 1,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stats: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 8,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  activeActionText: {
    color: '#3ea6ff',
    fontWeight: 'bold',
  },
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  channelInfo: {
    flex: 1,
    marginLeft: 10,
  },
  channelName: {
    fontWeight: 'bold',
  },
  subscriberCount: {
    fontSize: 12,
    color: '#666',
  },
  subscribeButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribedButton: {
    backgroundColor: '#e0e0e0',
  },
  subscribeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subscribedText: {
    color: '#666',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentsIcon: {
    fontSize: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentUserIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    marginBottom: 4,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikes: {
    fontSize: 12,
    marginRight: 16,
  },
  commentReply: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoList: {
    flex: 1,
  },
  videoItem: {
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
  },
  videoInfoRow: {
    flexDirection: 'row',
    padding: 12,
  },
  videoChannelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  videoStats: {
    fontSize: 12,
    color: '#666',
  },
  videoOptionsIcon: {
    fontSize: 16,
    color: '#666',
  },
  bottomBar: {
    flexDirection: 'row',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  bottomTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
    color: '#666',
  },
  activeTabIcon: {
    color: 'red',
  },
  tabText: {
    fontSize: 10,
    color: '#666',
  },
  activeTabText: {
    color: 'red',
  },
  plusIcon: {
    fontSize: 24,
    backgroundColor: '#f9f9f9',
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    borderRadius: 20,
  },
  backButton: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#333',
    fontWeight: '500',
  },
});
