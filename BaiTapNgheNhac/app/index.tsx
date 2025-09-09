import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Notifications from 'expo-notifications';

// Cấu hình notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DANH_SACH_PHAT = [
  {
    id: '1',
    title: 'Sự Nghiệp Chướng',
    artist: 'Pháo North Side',
    uri: require('../assets/images/song1.mp3'),
    artwork: 'https://i.pinimg.com/736x/5a/9e/f9/5a9ef95d5ea691c99c91d70ef1cd6b00.jpg',
  },
  {
    id: '2',
    title: 'Mất Kết Nối',
    artist: 'Dương Độ Mixi',
    uri: require('../assets/images/song2.mp3'),
    artwork: 'https://i.pinimg.com/736x/5b/9f/31/5b9f31cfb4f08f252326d07ac3ab5593.jpg',
  },
  {
    id: '3',
    title: 'Dù cho tận thế',
    artist: 'Erik',
    uri: require('../assets/images/song3.mp3'),
    artwork: 'https://i.pinimg.com/736x/fb/c7/68/fbc768d01edfe71f6aa1f48f49e88dd8.jpg',
  },
  {
    id: '4',
    title: 'Bắc Bling',
    artist: 'Hoà Minzy',
    uri: require('../assets/images/song4.mp3'),
    artwork: 'https://i.pinimg.com/736x/58/c5/c6/58c5c67ed08c358d27160f691efbc9fc.jpg',
  },
  {
    id: '5',
    title: 'Tháp Ép Phen',
    artist: 'Tùng Núi',
    uri: require('../assets/images/song5.mp3'),
    artwork: 'https://i.ytimg.com/vi/9hsoYO26oxM/maxresdefault.jpg',
  },
  {
    id: '6',
    title: 'Thái Bling',
    artist: 'Linh Minzy',
    uri: require('../assets/images/song6.mp3'),
    artwork: 'https://scontent.fhan14-2.fna.fbcdn.net/v/t1.6435-9/69568276_2474375996176813_7405815166509514752_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_ohc=UhbJTtJVL5AQ7kNvwFRb6qS&_nc_oc=AdlFjuBsKNPbirOmtaz1N8KlAjiRGTT9vf8Lt7YUrizGo7nVTVOGmMbg3Mmy89itVYwSic7scBtRnA630pSZKqlc&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=QHyaRdfWkwUoIO5pordJhA&oh=00_AfGeH0BAP95HrcGKo9lRAkXyOfoztYNLzGiNfRUTvHZ8rA&oe=681AEE77',
  },
  {
    id: '7',
    title: 'Trên trời cao con rớt xuống đây',
    artist: 'Moon Cute',
    uri: require('../assets/images/song7.mp3'),
    artwork: 'https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-6/464630673_8460314800762007_520378400232963182_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=f727a1&_nc_ohc=rCHzEPNWiosQ7kNvwHOilac&_nc_oc=AdkQA9b7z9ZBn-S3pvzzH02EaYm7lTw_GUoXrI5aJSXWy-mlix8_FhSj8t6c9oVrL0lfgFpNhEeSm15SA4KoyxT0&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&_nc_gid=i8K_uqlIsNED83z3LHLYvA&oh=00_AfEUIuuRozwrzowJkbVAj02EeDE7ybwlYTGtpYN7C0A-9w&oe=67F96F78',
  },
  {
    id: '8',
    title: 'Cô Giáo em cười xinh xinh',
    artist: 'Ruby Skibidi',
    uri: require('../assets/images/song8.mp3'),
    artwork: 'https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/467868580_8612821722177980_6086588898460025315_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=zxABM_VBraYQ7kNvwH6GJtP&_nc_oc=AdleDE30qP0L7ih88FQ0e8GikOjajpdTdoh_0YY53xR3rDnzFwQqkJqBZMK7t6Kb-p_WiEbSkXZunyw-GD3ZQU35&_nc_zt=23&_nc_ht=scontent.fhan14-1.fna&_nc_gid=n5gpe-8pKlLPuwWYbW1zgQ&oh=00_AfGQz2yhxD46cqOa8i3kVUq4joqmjpK_xskXNPynGDlhaw&oe=67F96C30',
  },
  {
    id: '9',
    title: 'Dummy',
    artist: 'Linh nigga',
    uri: require('../assets/images/song9.mp3'),
    artwork: 'https://image.remaker.ai/datarm/face-swap/ai_face_vary/2025-04-07/output/ed2864dd-afe5-462a-bd91-e13cbf90105d.jpg',
  },
];

const TrinhPhatNhac = () => {
  const [amThanh, datAmThanh] = useState<Audio.Sound | null>(null);
  const [baiHatHienTai, datBaiHatHienTai] = useState<any>(null);
  const [dangPhat, datDangPhat] = useState(false);
  const [dangTai, datDangTai] = useState(false);
  const [viTri, datViTri] = useState(0);
  const [thoiLuong, datThoiLuong] = useState(0);
  const [amLuong, datAmLuong] = useState(1.0);

  useEffect(() => {
    const yeuCauQuyen = async () => {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      
      if (audioStatus !== 'granted') {
        alert('Cần cấp quyền để sử dụng microphone và âm thanh!');
      }
      if (notificationStatus !== 'granted') {
        alert('Cần cấp quyền để hiển thị thông báo!');
      }
    };

    yeuCauQuyen();
    
    const configMusic = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };
    
    configMusic();

    return () => {
      if (amThanh) {
        amThanh.unloadAsync();
      }
      // Xóa notification khi thoát
      Notifications.dismissAllNotificationsAsync();
    };
  }, []);

  useEffect(() => {
    if (amThanh && dangPhat) {
      const khoangThoiGian = setInterval(async () => {
        try {
          const trangThai = await amThanh.getStatusAsync();
          if (trangThai.isLoaded) {
            datViTri(trangThai.positionMillis);
            datThoiLuong(trangThai.durationMillis || 0);
          }
        } catch (error) {
          console.error('Lỗi khi lấy trạng thái:', error);
        }
      }, 1000);
      return () => clearInterval(khoangThoiGian);
    }
  }, [amThanh, dangPhat]);

  const hienThiThongBao = async (baiHat: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Đang phát',
        body: `${baiHat.title} - ${baiHat.artist}`,
        data: { baiHat },
      },
      trigger: null,
    });
  };

  const phatBaiHat = async (baiHat: any) => {
    try {
      datDangTai(true);
      
      if (amThanh) {
        await amThanh.unloadAsync();
      }

      console.log('Đang tải bài hát:', baiHat.title);

      const { sound: amThanhMoi } = await Audio.Sound.createAsync(
        baiHat.uri, 
        { shouldPlay: true, volume: amLuong },
        capNhatTrangThaiPhat
      );

      datAmThanh(amThanhMoi);
      datBaiHatHienTai(baiHat);
      datDangPhat(true);
      datDangTai(false);
      
      // Hiển thị thông báo khi bắt đầu phát
      await hienThiThongBao(baiHat);
    } catch (error) {
      console.error('Lỗi khi phát nhạc:', error);
      datDangTai(false);
      alert(`Không thể phát bài hát: ${error.message}`);
    }
  };

  const capNhatTrangThaiPhat = (trangThai: any) => {
    if (trangThai.isLoaded) {
      datViTri(trangThai.positionMillis);
      datThoiLuong(trangThai.durationMillis);
      datDangPhat(trangThai.isPlaying);
      
      if (trangThai.didJustFinish) {
        phatBaiTiepTheo();
      }
    }
  };

  const chuyenDoiPhat = async () => {
    if (!amThanh) return;
    
    if (dangPhat) {
      await amThanh.pauseAsync();
      // Xóa thông báo khi tạm dừng
      await Notifications.dismissAllNotificationsAsync();
    } else {
      await amThanh.playAsync();
      // Hiển thị lại thông báo khi tiếp tục phát
      if (baiHatHienTai) {
        await hienThiThongBao(baiHatHienTai);
      }
    }
  };

  const phatBaiTiepTheo = () => {
    if (!baiHatHienTai) return;
    const viTriHienTai = DANH_SACH_PHAT.findIndex(baiHat => baiHat.id === baiHatHienTai.id);
    const viTriTiepTheo = (viTriHienTai + 1) % DANH_SACH_PHAT.length;
    phatBaiHat(DANH_SACH_PHAT[viTriTiepTheo]);
  };

  const phatBaiTruoc = () => {
    if (!baiHatHienTai) return;
    const viTriHienTai = DANH_SACH_PHAT.findIndex(baiHat => baiHat.id === baiHatHienTai.id);
    const viTriTruoc = (viTriHienTai - 1 + DANH_SACH_PHAT.length) % DANH_SACH_PHAT.length;
    phatBaiHat(DANH_SACH_PHAT[viTriTruoc]);
  };

  const tuaDen = async (giaTri: number) => {
    if (amThanh) {
      await amThanh.setPositionAsync(giaTri);
    }
  };

  const thayDoiAmLuong = async (giaTri: number) => {
    if (amThanh) {
      await amThanh.setVolumeAsync(giaTri);
      datAmLuong(giaTri);
    }
  };

  const dinhDangThoiGian = (miliGiay: number) => {
    if (miliGiay === 0) return '00:00';
    const tongGiay = Math.floor(miliGiay / 1000);
    const phut = Math.floor(tongGiay / 60);
    const giay = tongGiay % 60;
    return `${phut.toString().padStart(2, '0')}:${giay.toString().padStart(2, '0')}`;
  };

  const anhMacDinh = { uri: 'https://via.placeholder.com/60' };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Ứng dụng Nghe Nhạc</Text>
    </View>

    <ScrollView style={styles.playlist}>
      <Text style={styles.playlistTitle}>Danh sách phát</Text>
      {DANH_SACH_PHAT.map((song) => (
        <TouchableOpacity
          key={song.id}
          style={[
            styles.songItem,
            baiHatHienTai && baiHatHienTai.id === song.id ? styles.songItemActive : null,
          ]}
          onPress={() => phatBaiHat(song)}
        >
          <Image
            source={{ uri: song.artwork }}
            style={styles.songArtwork}
            defaultSource={anhMacDinh}
            onError={(e) => {
              console.log('Error loading song artwork:', e.nativeEvent.error);
            }}
          />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songArtist}>{song.artist}</Text>
          </View>
          {baiHatHienTai && baiHatHienTai.id === song.id && dangPhat && (
            <Ionicons name="musical-notes" size={20} color="#1DB954" />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>

      <View style={styles.player}>
        {baiHatHienTai ? (
          <>
            <View style={styles.songDetails}>
              <Image
                source={{ uri: baiHatHienTai.artwork }}
                style={styles.artwork}
                defaultSource={anhMacDinh}
                onError={(e) => {
                  console.log('Error loading image, using placeholder');
                }}
              />
              <View style={styles.songTitles}>
                <Text style={styles.nowPlayingTitle}>{baiHatHienTai.title}</Text>
                <Text style={styles.nowPlayingArtist}>{baiHatHienTai.artist}</Text>
              </View>
            </View>

            <View style={styles.progress}>
              <Text style={styles.time}>{dinhDangThoiGian(viTri)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={thoiLuong || 1}
                value={viTri}
                onSlidingComplete={tuaDen}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#1DB954"
              />
              <Text style={styles.time}>{dinhDangThoiGian(thoiLuong)}</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity onPress={phatBaiTruoc}>
                <Ionicons name="play-skip-back" size={32} color="#333" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.playButton} onPress={chuyenDoiPhat}>
                {dangTai ? (
                  <ActivityIndicator color="#fff" />
                ) : dangPhat ? (
                  <Ionicons name="pause" size={32} color="#fff" />
                ) : (
                  <Ionicons name="play" size={32} color="#fff" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={phatBaiTiepTheo}>
                <Ionicons name="play-skip-forward" size={32} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.volumeControl}>
              <Ionicons name="volume-low" size={20} color="#666" />
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={amLuong}
                onValueChange={thayDoiAmLuong}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#1DB954"
              />
              <Ionicons name="volume-high" size={20} color="#666" />
            </View>
          </>
        ) : (
          <Text style={styles.noSongText}>Chọn bài hát để phát</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playlist: {
    flex: 1,
    paddingHorizontal: 15,
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  songArtwork: {
    width: 40,  
    height: 40,
    borderRadius: 4,
    marginRight: 10,  
    backgroundColor: '#ddd',
  },
  songItemActive: {
    backgroundColor: '#f0fff0',
    borderLeftWidth: 3,
    borderLeftColor: '#1DB954',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  player: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  songDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  songTitles: {
    marginLeft: 15,
    flex: 1,
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  nowPlayingArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  time: {
    fontSize: 12,
    color: '#666',
    width: 45,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  noSongText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 30,
  }
});

export default TrinhPhatNhac;