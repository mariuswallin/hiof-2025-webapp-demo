"use client";

import type { User } from "@/db/schema";
import { createContext } from "react";

export const AuthContext = createContext<{ user: User | undefined }>({
  user: undefined,
});

export function AuthProvider({
  user,
  children,
}: {
  user: User | undefined;
  children: React.ReactNode;
}) {
  return <AuthContext value={{ user }}>{children}</AuthContext>;
}
