"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(name, email, password);
        toast.success("Account created! Let's pick a plan.");
        // 🚀 Push new users to the pricing page
        router.push("/pricing");
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
        // Route returning users to the dashboard
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-cyan/50 focus:bg-background"
            placeholder="John Doe"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-cyan/50 focus:bg-background"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-cyan/50 focus:bg-background"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSignUp ? "Create Account" : "Sign In"}
      </button>

      <div className="mt-4 text-center">
        <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-muted-foreground hover:text-cyan transition-colors">
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>
    </form>
  );
}
