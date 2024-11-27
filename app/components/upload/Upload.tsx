import React, { useState } from 'react';
import { TextInput, Text, View, Image, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { useSession } from '../context/ctx';
  
export default function Upload() {
    const [postPic, setPostPic] = useState("");
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const { session } = useSession();
    const user = session ? JSON.parse(session) : null;

    const createFormData = (photo:ImagePicker.ImagePickerAsset | null, caption: string) => {

        const data = new FormData();

        if (!photo) {
            return data;
        }
    
        if (photo.fileName && photo.type && photo.uri) {
            let fileName = photo.fileName ?? "";
            let type = photo.mimeType ?? "";
            let uri = photo.uri ?? "";

            data.append('image', {
                name: fileName,
                type: type,
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            } as any);
        }

        if(caption) {    
            data.append('caption', caption);
        }
      
        return data;
      };
      

    const handleImagePicker = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permission to access camera roll is required!");
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                base64: true,
            });

            if (!pickerResult.canceled) {
                setPostPic(pickerResult.assets[0].uri);
                setFile(pickerResult.assets[0]);
            }
        } catch (error) {
            console.error("Error opening gallery:", error);
        }
    };
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://192.168.1.8:3001/api/posts/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user.token}`
                },
                body: createFormData(file, caption),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error("Error al crear el post");
            }
        } catch (error) {
            console.error("Error al crear el post:", error);
        }
    };
  return (
    <View>
        <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={{
                uri:
                  postPic ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.profileImage}
            />
        </TouchableOpacity>
        <TextInput
          style={{ height: 40, borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 5, width: "100%" }}
          placeholder="Caption"
          placeholderTextColor="#C4C4C4"
          onChangeText={setCaption}
          value={caption}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text>Submit</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
});