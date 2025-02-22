// PostItem.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Post } from "../types";

type PostItemProps = {
  post: Post;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
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
            <Text className="text-gray-800 text-sm font-medium">{post.author}</Text>
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
  );
};

export default PostItem;
