import { Drawer } from "expo-router/drawer";
import { Feather } from "@expo/vector-icons";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";
import "../global.css";

function ProtectedLayout() {
  const { isAuthenticated, isTeacherOrAdmin } = useAuth();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
        drawerType: "front",
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      {isTeacherOrAdmin && (
        <Drawer.Screen
          name="post/create"
          options={{
            drawerLabel: "Create Post",
            drawerIcon: ({ color }) => (
              <Feather name="plus-circle" size={24} color={color} />
            ),
          }}
        />
      )}
    </Drawer>
  );
}

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <ProtectedLayout />
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
