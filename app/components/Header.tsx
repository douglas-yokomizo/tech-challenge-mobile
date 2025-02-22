// Header.tsx
import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuPress: () => void; // Função para abrir o menu
};

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, onMenuPress }) => {
  return (
    <View className="px-4 py-2 flex-row items-center justify-between">
      {/* Ícone do menu */}
      <TouchableOpacity onPress={onMenuPress} className="p-2">
        <Feather name="menu" size={24} color="#000" />
      </TouchableOpacity>

      {/* Campo de busca */}
      <View className="flex-1 mx-2">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Feather name="search" size={20} color="#666" />
          <TextInput
            placeholder="Buscar por título..."
            className="flex-1 ml-2"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery} // Atualiza o valor do campo de busca
          />
        </View>
      </View>
    </View>
  );
};

export default Header;
