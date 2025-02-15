import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  posts: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isTeacherOrAdmin: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  isTeacherOrAdmin: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load token and user data from storage on app start
    Promise.all([
      AsyncStorage.getItem("auth_token"),
      AsyncStorage.getItem("user_data"),
    ]).then(([storedToken, storedUserData]) => {
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
      }
    });
  }, []);

  const login = async (newToken: string, userData: User) => {
    await Promise.all([
      AsyncStorage.setItem("auth_token", newToken),
      AsyncStorage.setItem("user_data", JSON.stringify(userData)),
    ]);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem("auth_token"),
      AsyncStorage.removeItem("user_data"),
    ]);
    setToken(null);
    setUser(null);
  };

  // Consider admin as teacher (they have the same permissions)
  const isTeacherOrAdmin = user?.isAdmin ?? false;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isTeacherOrAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
