import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Post } from "../../types";

const getApiUrl = (id: string) =>
  Platform.select({
    web: __DEV__
      ? `http://localhost:3001/api/posts/${id}`
      : `https://tech-challenge-back-end.vercel.app/posts/${id}`,
    default: `https://tech-challenge-back-end.vercel.app/posts/${id}`,
  });

export default function EditPost() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isTeacherOrAdmin, token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if user is not a teacher or admin
  if (!isTeacherOrAdmin) {
    return <Redirect href="/" />;
  }

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(getApiUrl(id as string), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data: Post = await response.json();
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(getApiUrl(id as string), {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      router.back();
    } catch (err) {
      console.error("Error updating post:", err);
      Alert.alert("Error", "Failed to update post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500 mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-2 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold ml-2">Edit Post</Text>
      </View>
      <View className="flex-1 p-4">
        <TextInput
          className="border border-gray-300 p-3 mb-4 rounded-md"
          placeholder="Post Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="border border-gray-300 p-3 mb-4 rounded-md flex-1"
          placeholder="Post Content"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-md"
          onPress={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Update Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
