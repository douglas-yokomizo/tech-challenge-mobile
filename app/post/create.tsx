import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    // Handle post creation
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Create New Post</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md"
        placeholder="Post Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md h-40"
        placeholder="Post Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity
        className="bg-green-500 p-4 rounded-md"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">
          Create Post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
