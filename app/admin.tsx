import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Admin() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Admin Panel</Text>
      <Link href="/teacher/list" asChild>
        <TouchableOpacity className="bg-purple-500 p-4 rounded-md mb-2">
          <Text className="text-white text-center font-semibold">
            Manage Teachers
          </Text>
        </TouchableOpacity>
      </Link>
      <Link href="/student/list" asChild>
        <TouchableOpacity className="bg-indigo-500 p-4 rounded-md">
          <Text className="text-white text-center font-semibold">
            Manage Students
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
