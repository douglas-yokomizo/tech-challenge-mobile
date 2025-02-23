import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { Post } from "../../types";
import axios from "axios";

const API_URL = "https://tech-challenge-back-end.vercel.app";

export default function EditPost() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isTeacherOrAdmin, token } = useAuth();
  const { dispatch } = useAppContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // Redirect if user is not teacher or admin
  if (!isTeacherOrAdmin) {
    return <Redirect href="/" />;
  }

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedPosts = response.data.sort(
        (a: Post, b: Post) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      dispatch({ type: "SET_POSTS", payload: sortedPosts });
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, [dispatch, token]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    try {
      setIsSaving(true);
      await axios.patch(
        `${API_URL}/posts/${id}`,
        {
          title: title.trim(),
          content: content.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh posts list
      await fetchPosts();
      setIsSuccessModalVisible(true);
    } catch (err) {
      console.error("Error updating post:", err);
      Alert.alert("Error", "Failed to update post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSaving(true);
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh posts after deletion
      await fetchPosts();
      router.replace("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post");
    } finally {
      setIsSaving(false);
      setIsDeleteModalVisible(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="mb-4 text-red-500">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="px-4 py-2 bg-blue-500 rounded-full"
        >
          <Text className="text-white">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <Pressable
          className="items-center justify-center flex-1 bg-black/50"
          onPress={() => setIsDeleteModalVisible(false)}
        >
          <Pressable
            className="m-5 bg-white p-8 rounded-2xl shadow-xl min-w-[300px]"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="mb-4 text-xl font-bold text-center">
              Deletar Post
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              Você tem certeza que deseja deletar este post?
            </Text>
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text className="font-medium text-gray-800">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-red-500 rounded-lg"
                onPress={handleDelete}
              >
                <Text className="font-medium text-white">Deletar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSuccessModalVisible}
        onRequestClose={() => {
          setIsSuccessModalVisible(false);
          router.replace("/");
        }}
      >
        <Pressable
          className="items-center justify-center flex-1 bg-black/50"
          onPress={() => {
            setIsSuccessModalVisible(false);
            router.replace("/");
          }}
        >
          <Pressable
            className="m-5 bg-white p-8 rounded-2xl shadow-xl min-w-[300px]"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="mb-4 text-xl font-bold text-center">
              Post Atualizado
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              O post foi atualizado com sucesso!
            </Text>
            <View className="flex-row justify-center">
              <TouchableOpacity
                className="px-4 py-2 bg-blue-500 rounded-lg"
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  router.replace("/");
                }}
              >
                <Text className="font-medium text-white">OK</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Editar Post</Text>
        <View style={{ width: 40 }} />
      </View>

      <View className="flex-1 p-4">
        <TextInput
          className="p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Post Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="flex-1 p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Post Content"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          className="p-4 bg-blue-500 rounded-md"
          onPress={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-center text-white">
              Atualizar Post
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 mt-4 bg-red-500 rounded-md"
          onPress={() => setIsDeleteModalVisible(true)}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-center text-white">
              Deletar Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
