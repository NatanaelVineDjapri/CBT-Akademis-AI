"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { me, User } from "../services/AuthServices";
import { useRouter } from "next/navigation";

interface UserContextType {
  user: User | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({ user: null, refreshUser: async () => {} });

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const refreshUser = async () => {
    const u = await me();
    setUser(u);
  };

  useEffect(() => {
    me().then(setUser).catch(() => router.replace("/login"));
  }, []);

  if (!user) return null;

  return <UserContext.Provider value={{ user, refreshUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
