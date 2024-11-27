import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Post from '../components/feed/Post';
import { useLocalSearchParams } from 'expo-router';
import { useSession, API_URL } from '../components/context/ctx';


export default function PostScreen() {
  
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [postId, setPostId] = useState<string>("");
  const [post, setPost] = useState<any>(null);
  const { session } = useSession();
  const user = session ? JSON.parse(session) : null;
  const token = user ? user.token : null;

  if (!id) {
    return <Text>Loading...</Text>;
  }

  const findPost = (posts: any[]) => {
    return posts.find((post: any) => post._id === id);
  };

  useEffect(() => {
    setPostId(id);
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/feed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const postFound = findPost(data);
          setPost(postFound);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <Text>Loading...</Text>;
  }

  console.log(post);
  return (
    <View>
      <Post post={{
        id: post._id,
        userId: post.user._id,
        caption: post.caption,
        image: `${API_URL}/${post.imageUrl}`,
        createdAt: post.createdAt,
        comments: post.comments,
        likes: post.likes
      }} />
    </View>
  );
}