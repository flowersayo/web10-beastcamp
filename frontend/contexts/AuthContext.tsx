"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  const value: AuthContextValue = { token, setToken, nickname, setNickname };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext's useAuth function Error");
  }
  return context;
}
