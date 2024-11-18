import React from "react";
import { View, StyleSheet } from "react-native";
import ScreenProfile from "./_screenProfile";

export default function ProfileLayout() {
  return (
    <View style={styles.container}>
      <ScreenProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
