import {
  View,
  Text,
  RefreshControl,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useAppContext } from "./context/AppContext";
import { useCallback, useEffect } from "react";
import Animated, { FadeIn } from "react-native-reanimated";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  const { posts, isLoading, error, currentPage } = state;

  const fetchPosts = useCallback(async (page: number, refresh = false) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      // Simulate API call with dummy data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newPosts = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
        id: `${page}-${i}`,
        title: `Post ${page}-${i}`,
        author: "Author Name",
        date: new Date().toISOString(),
        readTime: "5 min",
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        image: `https://picsum.photos/seed/${page}-${i}/400/300`,
      }));

      if (refresh) {
        dispatch({ type: "SET_POSTS", payload: newPosts });
      } else {
        dispatch({ type: "ADD_POSTS", payload: newPosts });
      }
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load posts" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading) {
      dispatch({ type: "INCREMENT_PAGE" });
      fetchPosts(currentPage + 1);
    }
  }, [isLoading, currentPage, fetchPosts]);

  useEffect(() => {
    fetchPosts(1, true);
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

  const renderPost = ({ item: post }) => (
    <Animated.View entering={FadeIn}>
      <Link href={`/post/${post.id}`} asChild>
        <TouchableOpacity className="flex-row mb-4 px-4">
          <Image
            source={{ uri: post.image }}
            className="w-24 h-24 rounded-lg bg-gray-200"
          />
          <View className="flex-1 ml-4">
            <Text className="text-base font-semibold mt-1">{post.title}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              {post.date} • {post.readTime} read
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-4">
                <Feather name="thumbs-up" size={14} color="#666" />
                <Text className="text-xs text-gray-500 ml-1">{post.likes}</Text>
              </View>
              <View className="flex-row items-center">
                <Feather name="message-circle" size={14} color="#666" />
                <Text className="text-xs text-gray-500 ml-1">
                  {post.comments}
                </Text>
              </View>
            </View>
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
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}
