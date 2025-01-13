import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";

const dummyPosts = [
  {
    id: "1",
    title: "Getting Started with React Native",
    author: "John Doe",
    date: "2023-05-15",
    readTime: "5 min",
    likes: 24,
    comments: 8,
    image: "https://picsum.photos/seed/post1/400/300",
  },
  {
    id: "2",
    title: "Advanced TypeScript Techniques",
    author: "Jane Smith",
    date: "2023-05-18",
    readTime: "8 min",
    likes: 42,
    comments: 15,
    image: "https://picsum.photos/seed/post2/400/300",
  },
  {
    id: "3",
    title: "Building Scalable Mobile Apps",
    author: "Bob Johnson",
    date: "2023-05-20",
    readTime: "6 min",
    likes: 36,
    comments: 12,
    image: "https://picsum.photos/seed/post3/400/300",
  },
];

export default function Home() {
  const renderItem = ({ item }) => (
    <Link href={`/post/${item.id}`} asChild>
      <TouchableOpacity className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
        <Image source={{ uri: item.image }} className="w-full h-48" />
        <View className="p-4">
          <Text className="text-lg font-bold mb-2">{item.title}</Text>
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: `https://i.pravatar.cc/150?u=${item.author}` }}
              className="w-6 h-6 rounded-full mr-2"
            />
            <Text className="text-sm text-gray-600">{item.author}</Text>
          </View>
          <Text className="text-xs text-gray-500">
            {item.date} · {item.readTime} read
          </Text>
        </View>
        <View className="flex-row justify-between items-center p-4 bg-gray-50">
          <View className="flex-row items-center">
            <Feather name="thumbs-up" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-600 ml-1 mr-4">
              {item.likes}
            </Text>
            <Feather name="message-circle" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-600 ml-1">{item.comments}</Text>
          </View>
          <Feather name="book-open" size={16} color="#4B5563" />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-3xl font-bold mb-6">Your Daily Read</Text>
      <FlatList
        data={dummyPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <Link href="/post/create" asChild>
        <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg">
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
