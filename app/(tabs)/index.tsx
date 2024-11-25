import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSession } from '../components/context/ctx';
export default function HomeScreen() {

  const { signOut } = useSession();

  return (
    <View>
      <Text
        onPress={() => {
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}