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

const STORAGE_KEY = "enforma_auth_cache";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

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
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        persistUser(null);
        setReady(true);
        return;
      }

      // CRITICAL FIX: Use maybeSingle() instead of single()
      // This prevents the 406 Error and stops the app from logging you out
      // if the database takes an extra millisecond to create your profile.
      const { data: profile } = await supabase.from("profiles").select("full_name, current_plan").eq("id", session.user.id).maybeSingle();

      persistUser({
        id: session.user.id,
        email: session.user.email!,
        full_name: profile?.full_name || session.user.user_metadata?.full_name || "Athlete",
        current_plan: profile?.current_plan || "pending",
      });
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setReady(true);
    }
  }, [supabase, persistUser]);

  useEffect(() => {
    refreshUser();

    // CRITICAL FIX: Added 'session' parameter and removed token loop triggers
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
    [user, ready, refreshUser, supabase.auth, persistUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
