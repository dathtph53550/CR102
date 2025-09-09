import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

const Wrapper = ({ children, backgroundColor, barStyle }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={barStyle} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Wrapper;
