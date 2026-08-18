"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  current_plan?: string;
};

type AuthContextValue = {
  user: UserProfile | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isRefreshing: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Lightweight check that doesn't hammer Supabase with forced refresh tokens
  const refreshUser = useCallback(async () => {
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !authUser) {
        setUser(null);
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          full_name: authUser.user_metadata?.full_name || "Athlete",
          current_plan: authUser.user_metadata?.current_plan || "free",
        });
      }
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, [supabase]);

  useEffect(() => {
    refreshUser();

    // Listen strictly to actual auth state changes (Sign in, Sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
      } else if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || "Athlete",
          current_plan: session.user.user_metadata?.current_plan || "free",
        });
      }
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, [supabase, refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      refreshUser,
      isRefreshing,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refreshUser();
      },
      signUp: async (name, email, password) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        await refreshUser();
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setUser(null);
      },
    }),
    [user, ready, refreshUser, isRefreshing, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
