import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../context/ctx';
import PostComments from './PostComments';
import CreateCommentInput from './CreateCommentInput';
import LikePost from './LikePost';

export default function Post({ post }: { post: any }) {
  const { session } = useSession();
  const user = session ? JSON.parse(session) : null;

  return (
    <View style={styles.container}>
      <View style={styles.post}>
        <View style={styles.postImage}>
          <Image
            source={{
              uri:
                post.image ||
                "https://via.placeholder.com/150",
            }}
            style={styles.postImage}
          />
        </View>
        <View style={styles.likeSection}>
            <LikePost post={post} />
        </View>
        <View style={styles.comment}>
            <PostComments post={post} />
        </View>
        <View style={styles.commentbox}>
            <CreateCommentInput post={post} />
        </View>
        <View style={styles.postContent}>
          <Text style={styles.postContentText}>{post.caption}</Text>
          <Text style={styles.postContentText}>{post.createdAt}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  post: {
    padding: 10,
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  postContent: {
    padding: 10,
  },
  postContentText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  comment: {
    padding: 10,
  },
  commentText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  comments: {
    padding: 10,
  },
  commentbox: {
    padding: 20,
  },
  likeSection: {
    width: "20%",
  }
});