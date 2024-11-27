import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSession } from '../components/context/ctx';
import PostFeed from '../components/feed/PostFeed';
export default function HomeScreen() {

  return (
    <View>
      <PostFeed />
    </View>
  );
}