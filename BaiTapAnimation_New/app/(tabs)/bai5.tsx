import React from 'react';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

const Screen1 = ({ navigation }) => (
  <View style={[styles.screen, { backgroundColor: 'yellow' }]}> 
    <Text style={styles.text}>Screen 1</Text>
    <Button title="Sang màn 2" onPress={() => navigation.navigate('Screen2')} />
  </View>
);

const Screen2 = () => (
  <View style={[styles.screen, { backgroundColor: 'cyan' }]}> 
    <Text style={styles.text}>Screen 2</Text>
  </View>
);

const Stack = createStackNavigator();

export default function Bai5Stack() {
  return (
    <Stack.Navigator
      initialRouteName="Screen1"
      screenOptions={{
        headerShown: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              opacity: current.progress,
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Screen1" component={Screen1} />
      <Stack.Screen name="Screen2" component={Screen2} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  text: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 20
  }
});