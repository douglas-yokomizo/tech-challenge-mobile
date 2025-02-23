import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Post } from "../types";
import axios from "axios";

const API_URL = "https://tech-challenge-back-end.vercel.app";

export default function ManagePosts() {
  const { state, dispatch } = useAppContext();
  const { posts, isLoading, error } = state;
  const { isTeacherOrAdmin, token } = useAuth();
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedPosts = response.data.sort(
        (a: Post, b: Post) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      dispatch({ type: "SET_POSTS", payload: sortedPosts });
    } catch (err) {
      console.error("Error fetching posts:", err);
      dispatch({ type: "SET_ERROR", payload: "Failed to load posts" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [dispatch, token]);

  const handleDelete = useCallback(
    async (postId: string) => {
      Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              dispatch({ type: "SET_LOADING", payload: true });
              await axios.delete(`${API_URL}/posts/${postId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              // Refresh posts after deletion
              await fetchPosts();
              Alert.alert("Success", "Post deleted successfully");
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post");
            } finally {
              dispatch({ type: "SET_LOADING", payload: false });
            }
          },
        },
      ]);
    },
    [dispatch, token, fetchPosts]
  );

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (!isTeacherOrAdmin) {
    return (
      <SafeAreaView className="items-center justify-center flex-1">
        <Text>You are not authorized to view this page.</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Post }) => (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
      <View className="flex-1">
        <Text className="text-base font-bold">{item.title}</Text>
        <Text className="text-gray-600">{item.author}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => router.push(`/post/edit/${item._id}`)}
          className="p-2"
        >
          <Feather name="edit-2" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          className="p-2 ml-2"
        >
          <Feather name="trash-2" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Manage Posts</Text>
        <TouchableOpacity onPress={fetchPosts} className="p-2">
          <Feather name="refresh-cw" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" className="flex-1" />
      ) : error ? (
        <View className="items-center justify-center flex-1">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity
            onPress={fetchPosts}
            className="p-2 mt-4 bg-blue-500 rounded-full"
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshing={isLoading}
          onRefresh={fetchPosts}
        />
      )}
    </SafeAreaView>
  );
}
