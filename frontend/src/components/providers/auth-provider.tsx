/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { getDataSafe } from "@/utils/getData";
import { getClientToken } from "@/utils/getToken";
import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  team: { id: number; name: string };
  createdAt?: string;
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

  const getProfile = async () => {
    try {
      const data = await getDataSafe<User>("api/auth/profile");
      if (data.status === "success") {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("window:", typeof window, "cookie:", document.cookie);
    console.log("js-cookie:", getClientToken());
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
