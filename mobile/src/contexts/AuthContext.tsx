import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setSession } from "../services/api";
import { storage } from "../services/sessionStorage";
import { User } from "../types";
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
    async function restore() {
      try {
        const token = await storage.get();
        setSession(token, clear);
        if (token) setUser(await api<User>("/auth/me"));
      } catch { clear(); }
      finally { setLoading(false); }
    }
    void restore();
  }, []);
  const signIn = async (email: string, password: string, name?: string) => {
    const path = name ? "/auth/register" : "/auth/login";
    const data = await api<{ token: string; user: User }>(path, "POST", { email, password, name });
    await storage.set(data.token);
    setSession(data.token, clear);
    setUser(data.user);
  };
  const signOut = async () => {
    try { await api("/auth/logout", "POST"); }
    finally { clear(); }
  };
  return <Context.Provider value={{ user, loading, signIn, signOut }}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
