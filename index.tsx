import {
  View,
  Text,
  RefreshControl,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useAppContext } from "./context/AppContext";
import { useCallback, useEffect } from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { Post } from "./types";

const API_URL = Platform.select({
  // Use proxy in development on web
  web: __DEV__
    ? "http://localhost:3001/api/posts" // Full proxy URL
    : "https://tech-challenge-back-end.vercel.app/posts",
  // Use direct URL on native platforms
  default: "https://tech-challenge-back-end.vercel.app/posts",
});

export default function Home() {
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  const { posts, isLoading, error } = state;

  const fetchPosts = useCallback(async (refresh = false) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      dispatch({ type: "SET_POSTS", payload: data });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (err) {
      console.error("Error fetching posts:", err);
      dispatch({ type: "SET_ERROR", payload: "Failed to load posts" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const renderHeader = () => (
    <View className="px-4 py-2 flex-row items-center justify-between">
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="p-2"
      >
        <Feather name="menu" size={24} color="#000" />
      </TouchableOpacity>
      <View className="flex-1 mx-2">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Feather name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search..."
            className="flex-1 ml-2"
            placeholderTextColor="#666"
          />
        </View>
      </View>
      <TouchableOpacity>
        <Feather name="bell" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderPost = ({ item: post }: { item: Post }) => (
    <Animated.View entering={FadeIn}>
      <Link href={`/post/${post._id}`} asChild>
        <TouchableOpacity className="mb-6 bg-white">
          {post.img && (
            <Image
              source={{ uri: post.img }}
              className="w-full h-48 bg-gray-100"
              resizeMode="cover"
            />
          )}
          <View className="p-4">
            <Text className="text-xl font-semibold mb-2">{post.title}</Text>
            <View className="flex-row items-center mb-3">
              <View className="h-6 w-6 rounded-full bg-gray-200 mr-2 items-center justify-center">
                <Feather name="user" size={12} color="#666" />
              </View>
              <Text className="text-gray-800 text-sm font-medium">
                {post.author}
              </Text>
              <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
              <Text className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text className="text-gray-600" numberOfLines={2}>
              {post.content}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500 mb-4">{error}</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          className="bg-blue-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerClassName="pb-6"
        ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}
