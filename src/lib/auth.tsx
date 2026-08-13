"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type DemoUser = { name: string; email: string };

type AuthContextValue = {
  user: DemoUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<DemoUser>;
  signUp: (name: string, email: string, password: string) => Promise<DemoUser>;
  signOut: () => void;
};

const STORAGE_KEY = "enforma.demo.user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as DemoUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: DemoUser | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      signIn: async (email) => {
        await new Promise((r) => setTimeout(r, 700));
        const next: DemoUser = {
          name: email.split("@")[0]?.replace(/[._-]/g, " ") || "Athlete",
          email,
        };
        persist(next);
        return next;
      },
      signUp: async (name, email) => {
        await new Promise((r) => setTimeout(r, 900));
        const next: DemoUser = { name: name || "Athlete", email };
        persist(next);
        return next;
      },
      signOut: () => persist(null),
    }),
    [user, ready, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
