import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { Post } from "../types";

const API_URL = "https://tech-challenge-back-end.vercel.app";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { isTeacherOrAdmin, token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      setPost(data);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [fetchPost])
  );

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleDelete = useCallback(() => {
    setIsLoading(true);
    fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((deleteResponse) => {
        if (!deleteResponse.ok) {
          throw new Error("Failed to delete post");
        }
        return fetch(`${API_URL}/posts`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch updated posts");
        }
        return response.json();
      })
      .then((data) => {
        const sortedPosts = data.sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        dispatch({ type: "SET_POSTS", payload: sortedPosts });
        router.replace("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to delete post. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
        setIsDeleteModalVisible(false);
      });
  }, [id, router, token, dispatch]);

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX > 50) {
        handleBack();
      }
    })
    .activeOffsetX(10);

  if (isLoading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="mb-4 text-red-500">{error || "Post not found"}</Text>
        <TouchableOpacity
          onPress={handleBack}
          className="px-4 py-2 bg-blue-500 rounded-full"
        >
          <Text className="text-white">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <Pressable
          className="items-center justify-center flex-1 bg-black/50"
          onPress={() => setIsDeleteModalVisible(false)}
        >
          <Pressable
            className="m-5 bg-white p-8 rounded-2xl shadow-xl min-w-[300px]"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="mb-4 text-xl font-bold text-center">
              Deletar Post
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              Você tem certeza que deseja deletar este post?
            </Text>
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text className="font-medium text-gray-800">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-red-500 rounded-lg"
                onPress={handleDelete}
              >
                <Text className="font-medium text-white">Deletar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Header - Moved outside GestureDetector */}
      <View className="flex-row items-center px-4 pt-20 border-b border-gray-100">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1" />
        {isTeacherOrAdmin && (
          <>
            <TouchableOpacity
              className="p-2"
              onPress={() => router.push(`/post/edit/${id}`)}
            >
              <Feather name="edit-2" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2"
              onPress={() => setIsDeleteModalVisible(true)}
            >
              <Feather name="trash-2" size={24} color="#ff4444" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity className="p-2">
          <Feather name="share" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content - Inside GestureDetector */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.View entering={SlideInRight} className="flex-1">
          <Animated.ScrollView
            entering={FadeIn.delay(200)}
            className="flex-1"
            showsVerticalScrollIndicator={false}
          >
            {post.img && (
              <Image
                source={{ uri: post.img }}
                className="w-full h-56 bg-gray-100"
                resizeMode="cover"
              />
            )}
            <View className="p-4">
              <Text className="mb-2 text-2xl font-bold">{post.title}</Text>
              <View className="flex-row items-center mb-4">
                <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-200 rounded-full">
                  <Feather name="user" size={16} color="#666" />
                </View>
                <View>
                  <Text className="font-medium text-gray-800">
                    {post.author}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Criado em {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                  {post.updatedAt !== post.createdAt && (
                    <Text className="text-sm text-gray-500">
                      Editado em {new Date(post.updatedAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
              <Text className="leading-6 text-gray-700">{post.content}</Text>
            </View>
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}
