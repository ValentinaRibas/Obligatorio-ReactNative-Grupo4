import React from "react";
import { View } from "react-native";
import Profile from "../../components/profile/Profile";

interface ScreenProfileProps {
  route?: {
    params: {
      userId: string;
      token: string;
      currentUserId: string;
    };
  };
}

const ScreenProfile: React.FC<ScreenProfileProps> = ({ route }) => {
  const {
    // userId = "672bfbe5aee61744734c9e64",
    userId = "6726e6ced7b7d6629802616b",
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjZlNmNlZDdiN2Q2NjI5ODAyNjE2YiIsImlhdCI6MTczMTcwNzg2NSwiZXhwIjoxNzM0Mjk5ODY1fQ.Z880IWyG8cjPbpKewiqKHktlOHWnNqNruej4rAMAh-w",
    currentUserId = "6726e6ced7b7d6629802616b",
  } = route?.params || {};

  return (
    <View style={{ flex: 1 }}>
      <Profile userId={userId} token={token} currentUserId={currentUserId} />
    </View>
  );
};

export default ScreenProfile;
