"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Apple, Dumbbell, LayoutDashboard, LogOut, ScanLine, Settings, Menu, X } from "lucide-react";
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
  const { user, ready, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // State to control the mobile sidebar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close the mobile sidebar when clicking a link
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (ready && !user) router.replace("/");
  }, [user, ready, router]);

  if (!user || !ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <EnFormaLoader text="Loading your coach..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar: Fixed on Desktop, Sliding on Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-background px-4 py-6 transition-transform duration-300 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-6 lg:block">
          <Link href="/" className="block">
            <Image src="/logo.png" alt="EnForma AI Logo" width={132} height={132} className="object-contain p-1" />
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-1">
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
          onClick={async () => {
            await signOut();
            window.location.href = "/";
          }}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-6 py-5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Hamburger Menu Button for Mobile */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="rounded-md p-1 -ml-2 text-foreground hover:bg-surface-2 lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="font-display text-sm sm:text-2xl font-semibold tracking-tight">{title}</h1>
                {subtitle ? <p className="mt-1 sm:flex hidden text-xs sm:text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-right text-xs text-muted-foreground sm:block">
                <span className="block text-sm font-medium capitalize text-foreground">{user?.full_name || "Athlete"}</span>
                <span className="capitalize">{user?.current_plan || "No Plan"}</span>
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan/40 bg-surface-2 font-mono text-xs uppercase text-cyan">
                {user?.full_name?.substring(0, 2) || "U"}
              </span>
            </div>
          </div>
        </header>
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
