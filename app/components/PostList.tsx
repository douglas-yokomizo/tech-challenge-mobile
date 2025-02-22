// PostList.tsx
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import PostItem from "./PostItem";
import { Post } from "../types";

type PostListProps = {
  posts: Post[];
  filteredPosts: Post[];
  handleRefresh: () => void;
  isLoading: boolean;
};

const PostList: React.FC<PostListProps> = ({ posts, filteredPosts, handleRefresh, isLoading }) => {
  return (
    <FlatList
      data={filteredPosts}
      renderItem={({ item }) => <PostItem post={item} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingBottom: 20 }}
      ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
    />
  );
};

export default PostList;
