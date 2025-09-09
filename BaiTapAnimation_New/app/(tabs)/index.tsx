import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const App = () => {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  const moveBox = () => {
    offset.value = withTiming(offset.value === 0 ? 150 : 0, {
      duration: 500,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={moveBox}>
        <Text style={styles.buttonText}>MOVE</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.box, animatedStyles]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    paddingTop: 100,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  box: {
    width: 40,
    height: 40,
    backgroundColor: '#00008B',
    borderRadius: 5,
  },
});

export default App;
