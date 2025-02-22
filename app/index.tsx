// Home.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { SafeAreaView, ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import Header from "./components/Header"; // Importando o Header
import PostList from "./components/PostList";
import { useAppContext } from "./context/AppContext";
import { Post } from "./types";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

const API_URL = "https://tech-challenge-back-end.vercel.app/posts";

export default function Home() {
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  const { posts, isLoading, error } = state;

  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts); // Lista de posts filtrada
  const [searchQuery, setSearchQuery] = useState(""); // Texto de busca
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Timeout para debounce

  // Função para buscar todos os posts
  const fetchPosts = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Falha ao carregar os posts");
      }
      const data = await response.json();

      const sortedPosts = data.sort(
        (a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      dispatch({ type: "SET_POSTS", payload: sortedPosts });
      setFilteredPosts(sortedPosts); // Atualiza a lista filtrada
    } catch (err) {
      console.error("Erro ao buscar os posts:", err);
      dispatch({ type: "SET_ERROR", payload: "Falha ao carregar os posts" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [dispatch]);

  // Carregar posts ao iniciar
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Função para realizar a busca
  const handleSearch = (query: string) => {
    setSearchQuery(query); // Atualiza o valor do campo de busca

    // Limitar re-renderizações com debounce
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (query === "") {
        setFilteredPosts(posts); // Exibe todos os posts se a busca estiver vazia
      } else {
        const filtered = posts.filter((post) =>
          post.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPosts(filtered); // Filtra os posts conforme a busca
      }
    }, 500); // Debounce de 500ms
  };

  // Função de refresh para buscar os posts novamente
  const handleRefresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Função para abrir o menu
  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500 mb-4">{error}</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          className="bg-blue-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white">Tentar Novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        onMenuPress={openMenu} // Passa a função para abrir o menu
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <PostList
          posts={posts}
          filteredPosts={filteredPosts}
          handleRefresh={handleRefresh}
          isLoading={isLoading}
        />
      )}
    </SafeAreaView>
  );
}
