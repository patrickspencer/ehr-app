"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User } from "@/types";
import { getUser } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ehr_user_id");
    if (stored) {
      getUser(Number(stored))
        .then(setUser)
        .catch(() => localStorage.removeItem("ehr_user_id"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback((u: User) => {
    localStorage.setItem("ehr_user_id", String(u.id));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ehr_user_id");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
