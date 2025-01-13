import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditStudent() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("Existing Student Name");
  const [grade, setGrade] = useState("Existing Grade");
  const router = useRouter();

  const handleSubmit = () => {
    // Handle student update
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Edit Student</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md"
        placeholder="Student Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md"
        placeholder="Grade"
        value={grade}
        onChangeText={setGrade}
      />
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-md"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">
          Update Student
        </Text>
      </TouchableOpacity>
    </View>
  );
}
