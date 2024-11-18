import React, { useState } from 'react';
import { Image, StyleSheet, Platform, View, Button } from 'react-native';
import ProfileLayout from './modules/(profile)/_layout';
export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <ProfileLayout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
