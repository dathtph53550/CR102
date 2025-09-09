import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Bai4 = () => {
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState(1); // 1: right, -1: left

  // Hàm di chuyển xe theo hướng hiện tại
  const moveCarInDirection = () => {
    // Tính toán vị trí đích dựa vào hướng hiện tại
    const targetPosition = direction > 0 ? SCREEN_WIDTH - 180 : 0;
    
    translateX.value = withTiming(
      targetPosition,
      { 
        duration: 2000,
        easing: Easing.linear 
      },
      (finished) => {
        if (finished) {
          // Đảo chiều khi hoàn thành animation
          runOnJS(changeDirection)();
        }
      }
    );
  };

  // Đảo chiều và tiếp tục di chuyển xe
  const changeDirection = () => {
    if (isMoving) {
      setDirection(prev => prev * -1);
    }
  };

  // Theo dõi sự thay đổi của direction để kích hoạt animation mới
  useEffect(() => {
    if (isMoving) {
      moveCarInDirection();
    }
  }, [direction, isMoving]);

  const startMoving = () => {
    setIsMoving(true);
    // Quay bánh xe liên tục
    rotation.value = withRepeat(
      withTiming(360, { duration: 400 }),
      -1,
      false
    );
  };

  const stopMoving = () => {
    setIsMoving(false);
    cancelAnimation(rotation);
    cancelAnimation(translateX);
  };

  // Hiệu ứng quay cho bánh xe
  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Hiệu ứng di chuyển cho xe
  const carStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: direction > 0 ? 1 : -1 }
    ],
  }));

  // Kích hoạt animation khi component mount và isMoving thay đổi
  useEffect(() => {
    if (isMoving) {
      moveCarInDirection();
    }
  }, [isMoving]);

  return (
    <View style={styles.container}>
      <View style={styles.road} />
      <Animated.View style={[styles.carContainer, carStyle]}>
        <Image source={require('../../assets/images/car-body.png')} style={styles.carBody} />
        <View style={[styles.wheelContainer, styles.wheelLeftContainer]}>
          <Animated.Image 
            source={require('../../assets/images/wheel.avif')}
            style={[styles.wheelImage, wheelStyle]}
          />
        </View>
        <View style={[styles.wheelContainer, styles.wheelRightContainer]}>
          <Animated.Image 
            source={require('../../assets/images/wheel.avif')}
            style={[styles.wheelImage, wheelStyle]}
          />
        </View>
      </Animated.View>
      <View style={styles.buttonWrap}>
        <Button
          title={isMoving ? 'Dừng xe' : 'Chạy xe'}
          onPress={isMoving ? stopMoving : startMoving}
          color={isMoving ? '#e53935' : '#388e3c'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  road: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: '#b0bec5',
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#757575',
  },
  carContainer: {
    width: 180,
    height: 100,
    position: 'absolute',
    bottom: 95,
    left: 0,
  },
  carBody: {
    width: 180,
    height: 70,
    resizeMode: 'contain',
  },
  wheelContainer: {
    width: 34,
    height: 34,
    position: 'absolute',
    bottom: 0,
    borderRadius: 17,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#222',
  },
  wheelLeftContainer: {
    position: 'absolute',
    top: 38,
    left: 20,
  },
  wheelRightContainer: {
    position: 'absolute',
    top: 38,
    right: 24,
  },
  wheelImage: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  buttonWrap: {
    width: 180,
    marginBottom: 30,
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
});

export default Bai4;