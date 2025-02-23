import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import * as ImagePicker from "expo-image-picker";

const API_URL = "https://tech-challenge-back-end.vercel.app";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token, isTeacherOrAdmin, user } = useAuth();
  const { dispatch } = useAppContext();

  // Redirect if user is not a teacher or admin
  if (!isTeacherOrAdmin) {
    return <Redirect href="/" />;
  }

  const pickImage = async () => {
    try {
      if (Platform.OS === "web") {
        // Create a file input element
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        // Create a promise to handle the file selection
        const fileSelected = new Promise((resolve) => {
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            resolve(file);
          };
        });

        // Trigger file selection
        input.click();

        // Wait for file selection
        const file = await fileSelected;
        if (file) {
          setImage(file);
        }
      } else {
        // Native platforms
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Sorry, we need camera roll permissions to upload images."
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.8,
        });

        if (!result.canceled) {
          setImage(result.assets[0]);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        if (Platform.OS === "web") {
          // Web platform - image is already a File object
          formData.append("img", image);
        } else {
          // Native platforms - need to create a file object
          const localUri = image.uri;
          const filename = localUri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename || "");
          const type = match ? `image/${match[1]}` : "image/jpeg";

          formData.append("img", {
            uri: localUri,
            name: filename,
            type,
          } as any);
        }
      }

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        try {
          // Fetch updated posts
          const postsResponse = await axios.get(`${API_URL}/posts`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (postsResponse.data) {
            // Sort posts by creation date (newest first)
            const sortedPosts = postsResponse.data.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

            // Update posts in context
            dispatch({ type: "SET_POSTS", payload: sortedPosts });

            // Clear form
            setTitle("");
            setContent("");
            setImage(null);

            // Navigate and show success message
            router.replace("/");
            Alert.alert("Success", "Post created successfully");
          }
        } catch (fetchError) {
          console.error("Error fetching updated posts:", fetchError);
          // Still navigate even if fetch fails
          router.replace("/");
          Alert.alert(
            "Success",
            "Post created successfully. Please refresh to see updates."
          );
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Failed to create post. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="mb-4 text-2xl font-bold">Create New Post</Text>

        <Text className="mb-2 text-gray-600">Title</Text>
        <TextInput
          className="p-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Enter post title"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="mb-2 text-gray-600">Content</Text>
        <TextInput
          className="h-40 p-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Enter post content"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <Text className="mb-2 text-gray-600">Image</Text>
        <TouchableOpacity
          className="p-4 mb-4 bg-blue-500 rounded-md"
          onPress={pickImage}
        >
          <Text className="font-semibold text-center text-white">
            Pick an Image
          </Text>
        </TouchableOpacity>

        {image && (
          <View className="mb-4">
            <Image
              source={{
                uri:
                  Platform.OS === "web"
                    ? URL.createObjectURL(image)
                    : image.uri,
              }}
              className="w-full h-48 rounded-md"
              resizeMode="cover"
            />
          </View>
        )}

        <TouchableOpacity
          className="p-4 bg-green-500 rounded-md"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-center text-white">
              Create Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
