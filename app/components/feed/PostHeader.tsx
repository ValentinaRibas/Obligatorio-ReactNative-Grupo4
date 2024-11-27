import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSession, API_URL } from '../context/ctx';

export default function PostHeader({ post }: { post: any }) {
    const { session } = useSession();
    const user = session ? JSON.parse(session) : null;
    const token = user ? user.token : null;
    const [userImage, setUserImage] = useState<string>("https://via.placeholder.com/150");
    const [userName, setUserName] = useState<string>("");

    if (!post.userId) {
        return <Text>Loading Header...</Text>;
    }

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/api/user/profile/${post.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserImage(data.user.profilePicture);
                setUserName(data.user.username);
            } else {
                console.error("Error fetching profile");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <View style={styles.postHeader}>
            <Image
                source={{
                    uri: userImage
                }}
                style={styles.profileImage}
            />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
    },
    userInfo: {
        flexDirection: "column",
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
    }
});