import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // In a real app, this would be fetched from an API
  const article = {
    id: 1,
    title: "New VR Headsets That Will Shape the Metaverse",
    category: "Technology",
    image: "https://example.com/vr-image.jpg",
    author: {
      name: "Mason Eduard",
      avatar: "https://example.com/avatar.jpg",
    },
    date: "Jan 3, 2024",
    views: "2341",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id sit eu tellus sed cursus eleifend id porta. Lorem adipiscing mus vestibulum consequat porta eu ultrices feugiat. Et faucibus ut amet sit amet. Facilisis faucibus semper cras purus.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id sit eu tellus sed cursus eleifend id porta.

Fermentum et eget libero lectus. Amet, tellus`,
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-2 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-1" />
          <TouchableOpacity className="p-2">
            <Feather name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Article Content */}
        <View className="px-4">
          {/* Main Image */}
          <View className="relative">
            <Image
              source={{ uri: article.image }}
              className="w-full h-48 rounded-lg bg-gray-200"
            />
            <View className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded">
              <Text className="text-xs">{article.category}</Text>
            </View>
            <TouchableOpacity className="absolute top-2 right-2 bg-white/80 p-2 rounded">
              <Feather name="bookmark" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold mt-4">{article.title}</Text>

          {/* Author Info */}
          <View className="flex-row items-center mt-4">
            <Image
              source={{ uri: article.author.avatar }}
              className="w-8 h-8 rounded-full bg-gray-200"
            />
            <View className="ml-2">
              <Text className="text-sm">by {article.author.name}</Text>
              <Text className="text-xs text-gray-500">
                {article.date} • {article.views} views
              </Text>
            </View>
          </View>

          {/* Article Text */}
          <Text className="mt-6 text-gray-700 leading-6">
            {article.content}
          </Text>

          {/* Share Button */}
          <TouchableOpacity className="mt-8 mb-8">
            <View className="flex-row items-center justify-center bg-gray-100 py-3 rounded-lg">
              <Feather name="share-2" size={20} color="#000" />
              <Text className="ml-2 font-medium">Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
