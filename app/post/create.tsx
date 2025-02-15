import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

// Use the production API URL
const API_URL = "https://tech-challenge-back-end.vercel.app";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token, isTeacherOrAdmin, user } = useAuth();

  // Redirect if user is not a teacher or admin
  if (!isTeacherOrAdmin) {
    return <Redirect href="/" />;
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        {
          title,
          content,
          author: user?.name || "Unknown", // Use user's name as author
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Post created successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
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
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Create New Post</Text>

      <Text className="text-gray-600 mb-2">Title</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md"
        placeholder="Enter post title"
        value={title}
        onChangeText={setTitle}
      />

      <Text className="text-gray-600 mb-2">Content</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md h-40"
        placeholder="Enter post content"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity
        className="bg-green-500 p-4 rounded-md"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">
            Create Post
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
