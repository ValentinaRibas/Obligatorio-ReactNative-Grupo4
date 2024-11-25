import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ProfileProps {
  userId: string;
  token: string;
  currentUserId: string;
}

const BASE_URL = "http://192.168.1.8:3001";

const Profile: React.FC<ProfileProps> = ({ userId, token, currentUserId }) => {
  const [user, setUser] = useState<{
    _id: string;
    username: string;
    description: string;
    profilePicture: string;
    posts: string[];
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

  const numColumns = 3;
  const { width } = Dimensions.get("window");
  const itemSpacing = 3;
  const photoSize = (width - (numColumns + 1) * itemSpacing) / numColumns;

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
            posts: data.posts.length,
            friends: data.user.friends.length,
          });
          setUsername(data.user.username);
          setDescription(data.user.description);
          setProfilePic(data.user.profilePicture);
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

          setUser((prevUser) =>
            prevUser ? { ...prevUser, posts: userPosts.length } : prevUser
          );
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

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    const updatedData = {
      username: username,
      description: description,
      profilePicture: profilePic,
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

      if (user) {
        setUser({
          ...user,
          username: data.username ?? user.username,
          description: data.description ?? user.description,
          profilePicture: data.profilePicture ?? user.profilePicture,
          posts: user.posts,
          friends: user.friends,
          _id: user._id,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const handleImagePicker = async () => {
    if (isEditing) {
      try {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission to access camera roll is required!");
          return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          base64: false,
        });

        if (!pickerResult.canceled) {
          setProfilePic(pickerResult.assets[0].uri);
        }
      } catch (error) {
        console.error("Error opening gallery:", error);
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
      <View style={styles.header}>
        <View style={styles.leftColumn}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={{
                uri:
                  profilePic ||
                  user.profilePicture ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          ) : (
            <Text style={styles.username}>{user.username}</Text>
          )}
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
          ) : (
            <Text style={styles.description}>
              {user.description || "No bio available"}
            </Text>
          )}
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.stat}>
            <Text style={styles.bold}>{user.posts || 0}</Text> Posts
          </Text>
          <Text style={styles.stat}>
            <Text style={styles.bold}>{user.friends || 0}</Text> Friends
          </Text>
        </View>
      </View>

      {userId === currentUserId ? (
        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? handleSaveClick : handleEditClick}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Save" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            Alert.alert("Friend request sent!");
          }}
        >
          <Text style={styles.editButtonText}>Add Friend</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ padding: itemSpacing / 2 }}
        renderItem={({ item, index }) => {
          if (index % numColumns === 0) {
            return (
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: itemSpacing / 2,
                }}
              >
                {[item, photos[index + 1], photos[index + 2]].map(
                  (photo, rowIndex) =>
                    photo && (
                      <View
                        key={photo.id}
                        style={{
                          flex: 1 / numColumns,
                          marginHorizontal: itemSpacing / 2,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleOpenModal(photo)}
                        >
                          <Image
                            source={{ uri: photo.imageUrl }}
                            style={{
                              flex: 1,
                              aspectRatio: 1,
                              resizeMode: "cover",
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    )
                )}
              </View>
            );
          }
          return null;
        }}
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  leftColumn: {
    alignItems: "flex-start",
    flex: 1,
  },
  rightColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  description: {
    color: "#777",
    marginVertical: 5,
    textAlign: "left",
  },
  stat: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  editButton: {
    // marginHorizontal: 20,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 16,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    width: "100%",
  },
  photoGrid: {
    paddingHorizontal: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  modalCloseText: {
    color: "white",
    fontSize: 18,
  },
  modalImage: {
    width: "90%",
    height: "50%",
    resizeMode: "contain",
  },
});

export default Profile;
