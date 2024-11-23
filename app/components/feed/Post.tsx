import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';

const Post = ({ postId, profileImage, username, time, image, caption, likes, comments }) => {
  const [likeImg, setLikeImg] = useState(require('../../../assets/images/heart.png'));
  const [currentLikes, setLikes] = useState(likes);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (likes > 0) {
      setLikeImg(require('../../../assets/images/heart_black.png'));
    }
  }, [likes]);

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      setLikeImg(require('../../../assets/images/heart_black.png'));
      setLikes(currentLikes + 1);
    } else {
      setLiked(false);
      setLikeImg(require('../../../assets/images/heart.png'));
      setLikes(currentLikes - 1);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      await addComment(postId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const likePost = async (postId) => {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to like the post');
    }
  };

  const unlikePost = async (postId) => {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to unlike the post');
    }
  };

  const addComment = async (postId, comment) => {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: comment }),
    });
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    const data = await response.json();
    return data;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={profileImage ? { uri: profileImage } : require('../../../assets/images/default-profile.png')}
         style={styles.profileImage} 
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <TouchableOpacity>
          <Image source={require('../../../assets/images/DOTS.png')} />
        </TouchableOpacity>
      </View>
      <Image source={image ? { uri: image } : require('../../../assets/images/default-profile.png')} style={styles.postImage} />
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike}>
          <Image source={likeImg} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../../assets/images/comment.png')} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.likes}>{currentLikes} Likes</Text>
        <Text style={styles.caption}>
          <Text style={styles.username}>{username} </Text>
          {caption}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.addComment}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  content: {
    paddingBottom: 10,
  },
  likes: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caption: {
    fontSize: 14,
    marginBottom: 5,
  },
  addComment: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e6e6e6',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  postButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
