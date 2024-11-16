import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ProfileProps {
  userId: string;
  token: string;
  currentUserId: string;
}

const BASE_URL = "http://192.168.1.21:3001";

const Profile: React.FC<ProfileProps> = ({ userId, token, currentUserId }) => {
  const [user, setUser] = useState<{
    _id: string;
    username: string;
    description: string;
    profilePicture: string;
    followers: number;
    following: number;
    friends: string[];
  } | null>(null);

  const [photos, setPhotos] = useState<
    Array<{
      id: string;
      imageUrl: string;
      caption: string;
      likes: number;
      comments: number;
      username: string;
      profileImage: string;
    }>
  >([]);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<(typeof photos)[0] | null>(
    null
  );
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            ...data.user,
            followers: 1200,
            following: 350,
          });
          setUsername(data.user.username);
          setDescription(data.user.description);
          setProfilePic(data.user.profilePicture);
          setIsFriend(data.user.friends.includes(currentUserId));
        } else {
          console.error("Error fetching profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/posts/feed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const userPosts = data.filter(
            (post: any) => post.user._id === userId
          );
          const imageUrls = userPosts.map((post: any) => ({
            id: post._id,
            imageUrl: `${BASE_URL}/${post.imageUrl}`,
            caption: post.caption,
            likes: post.likes.length,
            comments: post.comments.length,
            username: post.user.username,
            profileImage: post.user.profilePicture,
          }));
          setPhotos(imageUrls);
        } else {
          console.error("Error fetching posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [userId, token, currentUserId]);

  const handleAddFriend = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/add-friend/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setIsFriend(true);
      } else {
        console.error("Error adding friend");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/remove-friend/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setIsFriend(false);
      } else {
        console.error("Error removing friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    const updatedData = {
      username: username || user?.username,
      description: description || user?.description,
      profilePicture: profilePic || user?.profilePicture,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/user/profile/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUser({ ...user, ...data });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImagePicker = async () => {
    if (isEditing) {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });

      if (!pickerResult.canceled && pickerResult.assets) {
        setProfilePic(
          `data:image/jpeg;base64,${pickerResult.assets[0].base64}`
        );
      }
    }
  };

  const handleOpenModal = (post: (typeof photos)[0]) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePicker}>
        <Image
          source={{ uri: profilePic || "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        ) : (
          <Text style={styles.username}>{username}</Text>
        )}
        <Button
          title={isEditing ? "Save" : "Edit Profile"}
          onPress={() => setIsEditing(!isEditing)}
        />
        <Text style={styles.stats}>{`${photos.length} posts`}</Text>
        <Text style={styles.stats}>{`Followers: ${user.followers}`}</Text>
        <Text style={styles.stats}>{`Following: ${user.following}`}</Text>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOpenModal(item)}>
            <Image source={{ uri: item.imageUrl }} style={styles.photo} />
          </TouchableOpacity>
        )}
        numColumns={3}
      />

      <Modal visible={isModalOpen} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={handleCloseModal}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          {selectedPost && (
            <View>
              <Image
                source={{ uri: selectedPost.imageUrl }}
                style={styles.modalImage}
              />
              <Text>{selectedPost.caption}</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  detailsContainer: { alignItems: "center" },
  username: { fontSize: 24, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    width: "80%",
  },
  stats: { fontSize: 16, marginVertical: 2 },
  photo: { width: 100, height: 100, margin: 5 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalCloseButton: { alignSelf: "flex-end", margin: 10 },
  modalCloseText: { color: "white", fontSize: 18 },
  modalImage: { width: 300, height: 300, alignSelf: "center" },
});

export default Profile;
