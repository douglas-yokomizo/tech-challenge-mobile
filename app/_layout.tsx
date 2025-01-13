import { Drawer } from "expo-router/drawer";
import { Feather } from "@expo/vector-icons";
import "../global.css";

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
        drawerType: "front",
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
  );
}
