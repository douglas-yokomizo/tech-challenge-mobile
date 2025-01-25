import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useCallback } from "react";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { state } = useAppContext();
  const post = state.posts.find((p) => p.id === id);

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

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500">Post not found</Text>
        <TouchableOpacity
          onPress={handleBack}
          className="mt-4 bg-blue-500 px-4 py-2 rounded-full"
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
          <View className="px-4 py-2 flex-row items-center">
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
            <Image
              source={{ uri: post.image }}
              className="w-full h-48 bg-gray-200"
            />
            <View className="p-4">
              <Text className="text-2xl font-bold">{post.title}</Text>
              <View className="flex-row items-center mt-2">
                <Text className="text-gray-500">By {post.author}</Text>
                <View className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                <Text className="text-gray-500">{post.readTime} read</Text>
              </View>
              <View className="flex-row items-center mt-4">
                <View className="flex-row items-center mr-4">
                  <Feather name="thumbs-up" size={20} color="#666" />
                  <Text className="text-gray-500 ml-2">{post.likes}</Text>
                </View>
                <View className="flex-row items-center">
                  <Feather name="message-circle" size={20} color="#666" />
                  <Text className="text-gray-500 ml-2">{post.comments}</Text>
                </View>
              </View>
              <Text className="mt-6 text-gray-700 leading-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>
          </Animated.ScrollView>
        </Animated.View>
      </SafeAreaView>
    </GestureDetector>
  );
}
