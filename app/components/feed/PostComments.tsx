import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../context/ctx';

export default function PostComments({ post }: { post: any }) {

  if (!post.comments || post.comments.length === 0) {
    return <Text>No hay comentarios</Text>;
  }

  return (
    <View style={styles.containder}>
      {
        post.comments && post.comments.map((comment: any, index: number) => {
          const commentFormatted = `${comment.user.username}: ${comment.content}`;
          return (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentText}>{commentFormatted}</Text>
            </View>
          );
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  containder: {
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 10,
  },
  comment: {
    padding: 10,
  },
  commentText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
  