"use client";

import type { User } from "@/db/schema";
import { createContext } from "react";

export const AuthContext = createContext<User | undefined>(undefined);

export function AuthProvider({
  user,
  children,
}: {
  user: User | undefined;
  children: React.ReactNode;
}) {
  const login = (userData: User) => {
    // Implement login logic here
  };

  const logout = () => {
    // Implement logout logic here
  };

  return (
    <AuthContext value={{ ...user, login, logout }}>{children}</AuthContext>
  );
}
