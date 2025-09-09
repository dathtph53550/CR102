import { Button, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const App = () => {
  const [media, setMedia] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  // Hàm kiểm tra và yêu cầu quyền truy cập
  const verifyPermissions = async () => {
    if (status?.status !== 'granted') {
      const result = await requestPermission();
      return result.granted;
    }
    return true;
  };

  // Hàm chụp ảnh
  const chupAnh = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets);
    }
  };

  // Hàm chọn ảnh từ thư viện
  const chonAnh = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets);
    }
  };

  // Hàm quay video
  const quayVideo = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets);
    }
  };

  // Hàm chọn video từ thư viện
  const chonVideo = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media Gallery</Text>
      <Text style={styles.subtitle}>Chọn hoặc chụp ảnh/video</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={chupAnh}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Chụp ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={chonAnh}>
          <Ionicons name="images" size={24} color="white" />
          <Text style={styles.buttonText}>Chọn ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={quayVideo}>
          <Ionicons name="videocam" size={24} color="white" />
          <Text style={styles.buttonText}>Quay video</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={chonVideo}>
          <Ionicons name="film" size={24} color="white" />
          <Text style={styles.buttonText}>Chọn video</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mediaScrollView}>
        {media ? (
          media.map((item, index) => (
            <View key={index} style={styles.mediaContainer}>
              {item.type === 'video' ? (
                <Video
                  source={{ uri: item.uri }}
                  style={styles.media}
                  useNativeControls
                  resizeMode="contain"
                  isLooping={false}
                />
              ) : (
                <Image
                  source={{ uri: item.uri }}
                  style={styles.media}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.mediaType}>
                {item.type === 'video' ? 'Video' : 'Ảnh'}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#ccc" />
            <Text style={styles.placeholder}>Chưa có media nào được chọn</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mediaScrollView: {
    flex: 1,
  },
  mediaContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  mediaType: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});