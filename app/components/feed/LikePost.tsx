import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession, API_URL } from '../context/ctx';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function LikePost({ post }: { post: any }) {

    const { session } = useSession();
    const user = session ? JSON.parse(session) : null;
    const token = user ? user.token : null;

    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        const likedEdnpoint = `${API_URL}/api/posts/${post.id}/like`;
        const method = liked ? "DELETE" : "POST";
        
        try {
            const response = await fetch(likedEdnpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setLiked(!liked);
            } else {
                console.error("Error al enviar like", response);
            }
        } catch (error) {
            console.error("Error al enviar like:", error);
            
        }
    };

    const findIfLiked = () => {
        setLiked(false);
        if (post.likes && post.likes.length > 0) {
            post.likes.forEach((like: any) => {
                if (like === user._id) {
                    setLiked(true);
                }
            });
        }
    };

    useEffect(() => {
        console.log(post.likes);
        findIfLiked();
    }, [post]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={handleLike}
            >
                {liked ? <FontAwesome name="heart" size={24} color="#fff" /> : <FontAwesome name="heart-o" size={24} color="#fff" />}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: "20%",
    },
    button: {
        width: "100%",
        height: 48,
        borderRadius: 8,
        backgroundColor: "#0070F3",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});