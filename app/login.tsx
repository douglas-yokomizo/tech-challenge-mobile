import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

const API_URL = "https://tech-challenge-back-end.vercel.app";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data?.token && response.data?.user) {
        await login(response.data.token, response.data.user);
        router.replace("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        "Failed to login. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center flex-1">
        <Image
          source={require('../assets/techSchool.png')} 
          className="mb-10"
        />

        <View className="space-y-4 w-80">
          <View>
            <Text className="text-gray-600 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-md mb-3"
              placeholder="Insira seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-2">Senha</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-md"
              placeholder="Insira sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-teal-950 p-4 rounded-md mt-4"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                Entrar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
