import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSession, API_URL } from '../context/ctx';
import Post from './Post';

export default function PostFeed() {

  const { session } = useSession();
  const user = session ? JSON.parse(session) : null;
  const token = user ? user.token : null;

  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const postFound = data.map((post: any) => ({
          id: post._id,
          userId: post.user._id,
          caption: post.caption,
          image: API_URL + '/' + post.imageUrl,
          createdAt: post.createdAt,
          comments: post.comments,
          likes: post.likes,
        }));
        console.log(postFound)
        setPosts(postFound);
      } else {
        console.error("Error fetching posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={fetchPosts} style={styles.button}>
        <Text style={styles.text}>
          Recargar Feed
        </Text>
      </TouchableOpacity>
      {
        posts && posts.length > 0 ?
        <ScrollView>
          {
            posts.map((post: any, index: number) => {
              return (
                <View key={index} style={styles.card}>
                  <Post post={post} />
                </View>
              );
            })
          }
        </ScrollView> :
        <TouchableOpacity onPress={() => router.push('/upload')} style={styles.button}>
          <Text style={styles.text}>No hay posts, click para subir uno</Text>
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "100%",
  },
  card: {
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#0070F3",
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: "#fff"
  }
});