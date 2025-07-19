/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import getBaseUrl from "@/utils/getBaseUrl";
import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  team: { id: number; name: string };
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = getBaseUrl();

  const getProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut d'authentification:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const value = {
    user,
    setUser,
    getProfile,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
