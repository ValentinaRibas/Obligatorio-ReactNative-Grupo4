import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../context/ctx';
import CreateCommentInput from './CreateCommentInput';
import LikePost from './LikePost';
import PostHeader from './PostHeader';

export default function Post({ post }: { post: any }) {
  const { session } = useSession();
  const user = session ? JSON.parse(session) : null;
  const [setComment, setComments] = useState<any[]>([]);

  const redirectToPost = () => {
    router.push({
      pathname: `/post`,
      params: { id: post.id },
    });
  };

  const redirectToProfile = () => {
    router.push({
      pathname: `/profile`,
      params: { profile: post.userId },
    });
  };


  return (
    <View style={styles.container}>
      <View style={styles.post}>
        {post && post.userId && post.userId !== user?._id ? (
          <TouchableOpacity onPress={redirectToProfile}>
            <PostHeader post={post} />
          </TouchableOpacity>
        ) : (
          null
        )}
        <TouchableOpacity onPress={redirectToPost}>
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
        </TouchableOpacity>
        <View style={styles.likeSection}>
            <LikePost post={post} />
            <Text style={styles.postContentText}>{"Descripción: " + post.caption}</Text>
        </View>
        <View style={styles.commentbox}>
            <CreateCommentInput post={post}/>
        </View>
        <View style={styles.postContent}>
          <Text style={styles.postContentText}>{post.createdAt}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 680,
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
    height: "100%",
    padding: 10,
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  postContent: {
    padding: 10,
  },
  postContentText: {
    fontSize: 16,
    fontWeight: "bold",
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
    padding: 10,
  },
  likeSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginBottom: 10,
  },
});