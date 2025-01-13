import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditPost() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("Existing Post Title");
  const [content, setContent] = useState("Existing post content...");
  const router = useRouter();

  const handleSubmit = () => {
    // Handle post update
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Edit Post</Text>
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
        className="bg-blue-500 p-4 rounded-md"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">
          Update Post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
