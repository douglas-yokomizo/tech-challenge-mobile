import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

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

const categories = ["All", "Technology", "Lifestyle", "Business", "Culture"];

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
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

        {/* Post List */}
        <View className="px-4">
          {dummyPosts.slice(1).map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} asChild>
              <TouchableOpacity className="flex-row mb-4">
                <Image
                  source={{ uri: post.image }}
                  className="w-24 h-24 rounded-lg bg-gray-200"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-base font-semibold mt-1">
                    {post.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {post.date} • {post.readTime} read
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View className="flex-row items-center mr-4">
                      <Feather name="thumbs-up" size={14} color="#666" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {post.likes}
                      </Text>
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
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
