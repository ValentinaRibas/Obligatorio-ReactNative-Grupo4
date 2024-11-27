import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSession, API_URL } from '../context/ctx';

export default function CreateCommentInput({ post }: { post: any }) {

    const { session } = useSession();
    const user = session ? JSON.parse(session) : null;
    const token = user ? user.token : null;

    const [text, setText] = useState("");

    const handleSubmit = async () => {
        console.log(post);
        try {
            const response = await fetch(`${API_URL}/api/posts/${post.id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ postId: post.id, content: text }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error("Error al enviar comentario");
            }
        } catch (error) {
            console.error("Error al enviar comentario:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe tu comentario"
                    placeholderTextColor="#C4C4C4"
                    onChangeText={(text) => setText(text)}
                    value={text}
                />
            </View>

            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    input: {
        width: "100%",
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#C4C4C4",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    button: {
        width: "20%",
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