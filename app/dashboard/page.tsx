import Link from "next/link";
import { Activity, Apple, Dumbbell, Flame, ScanLine, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Dashboard - EnForma AI",
  description: "Your daily macros, training readiness and habit streaks.",
  openGraph: {
    title: "Dashboard - EnForma AI",
    description: "Daily macros, readiness and streaks at a glance.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const stats = [
  { label: "Calories today", value: "1,840", sub: "of 2,350 kcal", icon: Flame },
  { label: "Protein", value: "142g", sub: "of 175g", icon: Apple },
  { label: "Readiness", value: "82%", sub: "HRV trending up", icon: Activity },
  { label: "Streak", value: "23 days", sub: "personal best", icon: TrendingUp },
];

const actions = [
  { to: "/nutrition", label: "Scan a meal", desc: "Photo → macros in 3 seconds", icon: Apple },
  { to: "/workouts", label: "Today's session", desc: "Push A · 47 min", icon: Dumbbell },
  { to: "/form-coach", label: "Check my form", desc: "Camera-based scoring", icon: ScanLine },
] as const;

export default function DashboardPage() {
  return (
    <AppShell title="Today" subtitle="Wednesday · Week 4 of your hypertrophy block">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface/50 p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-cyan" />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.to}
            href={a.to}
            className="group rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-cyan/40 hover:bg-surface-2/60"
          >
            <a.icon className="h-5 w-5 text-accent" />
            <p className="mt-4 font-display text-lg font-semibold tracking-tight">{a.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface/40 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Recent activity</p>
        <ul className="mt-4 divide-y divide-border">
          {[
            ["Grilled salmon bowl scanned", "612 kcal · 44g protein", "1h ago"],
            ["Back squat form graded", "Score 84/100 · depth improved", "Yesterday"],
            ["Pull B session completed", "6 exercises · 52 min", "Yesterday"],
            ["Water goal hit", "3.1L logged", "2 days ago"],
          ].map(([t, d, w]) => (
            <li key={t} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-sm text-foreground">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
              <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
