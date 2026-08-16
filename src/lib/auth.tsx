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
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  // Initialize the Supabase client
  const supabase = createClient();

  // Fetch the active session and query the public.profiles table
  const refreshUser = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setReady(true);
        return;
      }

      // Query the database for the user's specific profile data
      const { data: profile } = await supabase.from("profiles").select("full_name, current_plan").eq("id", session.user.id).single();

      setUser({
        id: session.user.id,
        email: session.user.email!,
        // Check the database profile first, fallback to auth metadata if needed
        full_name: profile?.full_name || session.user.user_metadata?.full_name,
        current_plan: profile?.current_plan || "pending",
      });
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, [supabase]);

  useEffect(() => {
    refreshUser();

    // Listen for auth state changes (e.g., logging in/out from another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });

    return () => subscription.unsubscribe();
  }, [refreshUser, supabase.auth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      refreshUser,
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
    [user, ready, refreshUser, supabase.auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
