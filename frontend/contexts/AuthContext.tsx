"use client";

import { createContext, useState, useContext, ReactNode } from "react";
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
  // 초기 렌더링 시 한 번만 getUserId() 호출
  const [userId] = useState<string>(() => {
    // 서버 사이드 렌더링 시 빈 문자열 반환
    if (typeof window === 'undefined') return '';
    return getUserId();
  });

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
