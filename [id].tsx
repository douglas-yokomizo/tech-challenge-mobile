import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppContext } from "./app/context/AppContext";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import { Post } from "./types";

const getApiUrl = (id: string) =>
  Platform.select({
    // Use proxy in development on web
    web: __DEV__
      ? `http://localhost:3001/api/posts/${id}`
      : `https://tech-challenge-back-end.vercel.app/posts/${id}`,
    // Use direct URL on native platforms
    default: `https://tech-challenge-back-end.vercel.app/posts/${id}`,
  });

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { state } = useAppContext();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(getApiUrl(id as string), {
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

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX > 50) {
        handleBack();
      }
    })
    .activeOffsetX(10);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500 mb-4">{error || "Post not found"}</Text>
        <TouchableOpacity
          onPress={handleBack}
          className="bg-blue-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <GestureDetector gesture={swipeGesture}>
      <SafeAreaView className="flex-1 bg-white">
        <Animated.View entering={SlideInRight} className="flex-1">
          {/* Header */}
          <View className="px-4 py-2 flex-row items-center border-b border-gray-100">
            <TouchableOpacity onPress={handleBack} className="p-2">
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <View className="flex-1" />
            <TouchableOpacity className="p-2">
              <Feather name="share" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 ml-2">
              <Feather name="bookmark" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
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
              <Text className="text-2xl font-bold mb-2">{post.title}</Text>
              <View className="flex-row items-center mb-4">
                <View className="h-8 w-8 rounded-full bg-gray-200 mr-3 items-center justify-center">
                  <Feather name="user" size={16} color="#666" />
                </View>
                <View>
                  <Text className="text-gray-800 font-medium">
                    {post.author}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                    {post.updatedAt !== post.createdAt && " (edited)"}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-700 leading-6">{post.content}</Text>
            </View>
          </Animated.ScrollView>
        </Animated.View>
      </SafeAreaView>
    </GestureDetector>
  );
}
