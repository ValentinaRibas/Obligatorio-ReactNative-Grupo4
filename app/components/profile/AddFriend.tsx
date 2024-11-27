import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSession, API_URL } from "../context/ctx";
import { FontAwesome } from "@expo/vector-icons";

function AddFriend({ userId, friends }: { userId: string; friends: any[] }) {
  const { session } = useSession();
  const user = session ? JSON.parse(session) : null;
  const token = user ? user.token : null;
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (friends) {
      setIsFriend(friends.find((friend: any) => friend._id === user._id));
    }
  }, [friends]);

  const handleAddFriend = async () => {
    try {
      const targetUrl = isFriend ? `${API_URL}/api/user/remove-friend/${userId}` : `${API_URL}/api/user/add-friend/${userId}`;
      const method = isFriend ? "DELETE" : "POST";
      const response = await fetch(targetUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFriend(!isFriend);
      } else {
        console.error("Error al enviar seguir", response);
      }
    } catch (error) {
      console.error("Error al enviar seguir:", error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.addFriendButton}
      onPress={handleAddFriend}
    >
      { isFriend ?  
        <View style={{ flexDirection: "row" }}>
            <FontAwesome name="heart" size={24} color="#fff" />
            <Text style={styles.addFriendButtonText}>Followed</Text>
        </View>
      : 
        <View style={{ flexDirection: "row" }}>
            <FontAwesome name="heart-o" size={24} color="#fff" />
            <Text style={styles.addFriendButtonText}>Follow</Text>
        </View>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addFriendButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    display: "flex",
    marginBottom: 20,
  },
  addFriendButtonText: {
    fontSize: 16,
    color: "#000",
    paddingLeft: 10,
  },
});

export default AddFriend;