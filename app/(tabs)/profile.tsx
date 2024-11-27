import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Profile from "../components/profile/Profile";
import { useLocalSearchParams, useGlobalSearchParams, Link, Redirect } from 'expo-router';
import { useSession } from "../components/context/ctx";

interface User {
  _id: string;
  token: string;
}

export default function ScreenProfile() {
  const { profile } = useLocalSearchParams<{ profile?: string }>();
  const { session } = useSession();
  const [targetProfile, setTargetProfile] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session) {
      const user = JSON.parse(session);
      setUser(user);
    }
  }, [session]);

  useEffect(() => {
    if (profile) {
      setTargetProfile(profile);
    } else {
      setTargetProfile(user?._id ?? "");
    }
  }, [user, profile]);

  return (
    <View style={{ flex: 1 }}>
      {user && <Profile userId={user._id} token={user.token} currentUserId={targetProfile} />}
    </View>
  );
};
