"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { getUserId } from "@/lib/user-id";

interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
  userId: string;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // 클라이언트 사이드에서만 userId 가져오기
    setUserId(getUserId());
  }, []);

  const value: AuthContextValue = { token, setToken, nickname, setNickname, userId };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext's useAuth function Error");
  }
  return context;
}
