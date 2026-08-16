"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Apple, Dumbbell, LayoutDashboard, LogOut, ScanLine, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { EnFormaLoader } from "@/components/ui/enforma-loader";
import Image from "next/image";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/nutrition", label: "Nutrition", icon: Apple },
  { to: "/form-coach", label: "Form Coach", icon: ScanLine },
  { to: "/progress", label: "Progress", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { user, ready, signOut, isRefreshing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user && !isRefreshing) router.replace("/");
  }, [user, ready, router, isRefreshing]);

  if (!user || !ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <EnFormaLoader text="Loading your coach..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-surface/40 px-4 py-6 lg:flex">
        <Link href="/" className="">
          <Image src="/logo.png" alt="EnForma AI Logo" width={134} height={134} className="object-contain p-1" />
        </Link>
        <nav className="flex flex-1 flex-col gap-1 mt-6">
          {nav.map((n) => (
            <Link
              key={n.to}
              href={n.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                pathname === n.to ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
              )}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            signOut();
            router.replace("/");
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-6 py-5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-right text-xs text-muted-foreground sm:block">
                <span className="block text-sm font-medium text-foreground capitalize">{user?.full_name || "Athlete"}</span>
                <span className="capitalize">{user?.current_plan || "No Plan"}</span>
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan/40 bg-surface-2 font-mono text-xs uppercase text-cyan">
                {user?.full_name?.substring(0, 2) || "U"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex gap-1 overflow-x-auto lg:hidden">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs",
                  pathname === n.to ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </header>

        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
