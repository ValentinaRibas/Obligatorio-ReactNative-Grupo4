import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '../context/ctx';
import { API_URL } from '../context/ctx';

export default function Notifications() {
  const { session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const user = session ? JSON.parse(session) : null;
  const token = user ? user.token : null;

  const fetchNotifications = async () => {
    const response = await fetch(`${API_URL}/api/user/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={fetchNotifications} style={styles.button}>
            <Text style={styles.text}>
                Recargar Notificaciones
            </Text>
      </TouchableOpacity>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            {
                item?.postId?._id && <TouchableOpacity onPress={() => router.push({
                    pathname: `/post`,
                    params: { id: item.postId._id },
                })}>
                    <Image
                        source={{
                            uri: item.postId.imageUrl ? API_URL + '/' + item.postId.imageUrl : 'https://via.placeholder.com/150',
                        }}
                        style={styles.notificationImage}
                    />
                    <Text style={styles.notificationText}>{item.fromUserId.username} te dejo un {item.type}</Text>
                    <Text style={styles.notificationText}>{item.createdAt}</Text>
                </TouchableOpacity>
            }
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    height: "100%",
  },
  notification: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  notificationText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    backgroundColor: "#0070F3",
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: "#fff"
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginBottom: 10,
  }
});