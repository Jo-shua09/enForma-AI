"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Lock, Mail, User, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function AuthForm() {
  const { user, ready, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      toast.error("Please fill in every field.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") await signIn(email, password);
      else await signUp(name, email, password);
      toast.success(mode === "signin" ? "Welcome back." : "Account created.");
      router.replace("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-20">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[680px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "var(--gradient-accent)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur"
      >
        <div className="mt-6 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface-2">
            <Zap className="h-4 w-4 text-accent" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            EnForma<span className="text-cyan"> AI</span>
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">{mode === "signin" ? "Welcome back." : "Create your account."}</h1>
        <div className="mt-6 inline-flex w-full rounded-xl border border-border bg-surface-2/60 p-1">
          {(
            [
              { k: "signin", l: "Sign in" },
              { k: "signup", l: "Create account" },
            ] as const
          ).map((o) => (
            <button
              key={o.k}
              type="button"
              onClick={() => setMode(o.k)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm transition-colors ${
                mode === o.k ? "bg-background text-foreground" : "text-muted-foreground"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <Field icon={<User className="h-4 w-4" />} label="Full name" value={name} onChange={setName} type="text" placeholder="Alex Carter" />
          ) : null}
          <Field icon={<Mail className="h-4 w-4" />} label="Email" value={email} onChange={setEmail} type="email" placeholder="you@enforma.ai" />
          <Field
            icon={<Lock className="h-4 w-4" />}
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center mt-6 justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "New to EnForma AI?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-cyan hover:underline">
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </main>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  type,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 focus-within:border-cyan/50">
        <span className="text-muted-foreground">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </span>
    </label>
  );
}
