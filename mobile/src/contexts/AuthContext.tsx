import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { api, setSession } from "../services/api";
import { User } from "../types";
const storage = {
  get: () =>
    Platform.OS === "web"
      ? Promise.resolve(sessionStorage.getItem("pv-token"))
      : SecureStore.getItemAsync("pv-token"),
  set: (value: string) =>
    Platform.OS === "web"
      ? Promise.resolve(sessionStorage.setItem("pv-token", value))
      : SecureStore.setItemAsync("pv-token", value),
  remove: () =>
    Platform.OS === "web"
      ? Promise.resolve(sessionStorage.removeItem("pv-token"))
      : SecureStore.deleteItemAsync("pv-token"),
};
type Auth = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};
const Context = createContext<Auth>({} as Auth);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const clear = () => {
    setUser(null);
    setSession(null);
    void storage.remove().catch(() => {});
  };
  useEffect(() => {
    (async () => {
      try {
        const token = await storage.get();
        setSession(token, clear);
        if (token) setUser(await api<User>("/auth/me"));
      } catch {
        clear();
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const signIn = async (email: string, password: string, name?: string) => {
    const data = await api<{ token: string; user: User }>(
      name ? "/auth/register" : "/auth/login",
      "POST",
      { email, password, name },
    );
    await storage.set(data.token);
    setSession(data.token, clear);
    setUser(data.user);
  };
  const signOut = async () => {
    try {
      await api("/auth/logout", "POST");
    } finally {
      clear();
    }
  };
  return (
    <Context.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
