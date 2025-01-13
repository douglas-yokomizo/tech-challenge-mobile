import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const dummyStudents = [
  { id: "1", name: "Alice Johnson", grade: "10th" },
  { id: "2", name: "Bob Smith", grade: "11th" },
  { id: "3", name: "Carol White", grade: "9th" },
];

export default function ListStudents() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Students List</Text>
      <FlatList
        data={dummyStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/student/edit/${item.id}`} asChild>
            <TouchableOpacity className="bg-gray-100 p-4 mb-2 rounded-md">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text>{item.grade}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
      <Link href="/student/create" asChild>
        <TouchableOpacity className="bg-green-500 p-4 rounded-md mt-4">
          <Text className="text-white text-center font-semibold">
            Add New Student
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
