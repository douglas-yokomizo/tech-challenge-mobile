import { Drawer } from "expo-router/drawer";
import { Feather } from "@expo/vector-icons";
import { AppProvider } from "./context/AppContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar style="dark" />
        <Drawer
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: "#fff",
              width: 280,
            },
            drawerType: "front",
            gestureEnabled: true,
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
          <Drawer.Screen
            name="profile"
            options={{
              drawerLabel: "Profile",
              drawerIcon: ({ color }) => (
                <Feather name="user" size={24} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="bookmarks"
            options={{
              drawerLabel: "Bookmarks",
              drawerIcon: ({ color }) => (
                <Feather name="bookmark" size={24} color={color} />
              ),
            }}
          />
        </Drawer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
