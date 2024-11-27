import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { useSession } from '../context/ctx';

export default function PostComments({ comments }: { comments: any[] }) {

  if (!comments || comments.length === 0) {
    return <Text>No hay comentarios</Text>;
  }

  return (
    <View style={styles.containder}>
      <Text style={styles.title}>Comentarios:</Text>
      <ScrollView style={styles.scrollView}>
        {
          comments && comments.map((comment: any, index: number) => {
            const commentFormatted = `${comment.user.username}: ${comment.content}`;
            return (
              <View key={index} style={styles.comment}>
                <Text style={styles.commentText}>{commentFormatted}</Text>
              </View>
            );
          })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containder: {
    padding: 10,
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  comment: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "gray",
    borderRadius: 10,
  },
  commentText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: -30,
  },
  scrollView: {
    height: "50%",
    padding: 10,
  }
});
  