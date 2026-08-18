"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  current_plan?: string;
  daily_calories?: number;
  protein_target?: number;
  training_days?: number;
  water_goal?: number;
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

const STORAGE_KEY = "enforma_auth_cache";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(STORAGE_KEY);
      if (cached) setUser(JSON.parse(cached));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const persistUser = useCallback((profile: UserProfile | null) => {
    setUser(profile);
    try {
      if (profile) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        persistUser(null);
        setReady(true);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, current_plan, daily_calories, protein_target, training_days, water_goal")
        .eq("id", session.user.id)
        .maybeSingle();

      persistUser({
        id: session.user.id,
        email: session.user.email!,
        full_name: profile?.full_name || session.user.user_metadata?.full_name || "Athlete",
        current_plan: profile?.current_plan || "pending",
        daily_calories: profile?.daily_calories,
        protein_target: profile?.protein_target,
        training_days: profile?.training_days,
        water_goal: profile?.water_goal,
      });
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setReady(true);
      setIsRefreshing(false);
    }
  }, [supabase, persistUser]);

  useEffect(() => {
    refreshUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        persistUser(null);
      } else if (event === "SIGNED_IN") {
        refreshUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUser, supabase.auth, persistUser]);

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
        persistUser(null);
      },
    }),
    [user, ready, refreshUser, isRefreshing, supabase.auth, persistUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
