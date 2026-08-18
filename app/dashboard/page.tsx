import Link from "next/link";
import { Activity, Apple, Dumbbell, Flame, ScanLine, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Dashboard - EnForma AI",
  description: "Your daily macros, training readiness and habit streaks.",
};

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });
}

async function getDashboardData() {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { recentActivity: [], totalMeals: 0 };

  // Fetch recent meals
  const { data: meals } = await supabase
    .from("meals")
    .select("food_items, calories, protein, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch recent workouts
  const { data: workouts } = await supabase
    .from("workouts")
    .select("title, target_muscle, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2);

  // Fetch recent form analyses
  const { data: forms } = await supabase
    .from("form_analysis")
    .select("exercise_name, form_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2);

  // Format into a unified activity feed
  const activityFeed: Array<{ title: string; subtitle: string; date: string }> = [];

  meals?.forEach((m) => {
    activityFeed.push({
      title: `Scanned: ${m.food_items?.[0] || "Meal"}`,
      subtitle: `${m.calories} kcal · ${m.protein}g protein`,
      date: new Date(m.created_at).toLocaleDateString(),
    });
  });

  workouts?.forEach((w) => {
    activityFeed.push({
      title: `Workout: ${w.title}`,
      subtitle: `Target: ${w.target_muscle}`,
      date: new Date(w.created_at).toLocaleDateString(),
    });
  });

  forms?.forEach((f) => {
    activityFeed.push({
      title: `Form Analysis: ${f.exercise_name}`,
      subtitle: `Score: ${f.form_score}/100`,
      date: new Date(f.created_at).toLocaleDateString(),
    });
  });

  return { activityFeed };
}

const actions = [
  { to: "/nutrition", label: "Scan a meal", desc: "Photo → macros in 3 seconds", icon: Apple },
  { to: "/workouts", label: "Today's session", desc: "AI custom workout splits", icon: Dumbbell },
  { to: "/form-coach", label: "Check my form", desc: "Camera-based scoring", icon: ScanLine },
] as const;

export default async function DashboardPage() {
  const { activityFeed } = await getDashboardData();

  const stats = [
    { label: "Calories today", value: "2,150", sub: "Target: 2,350 kcal", icon: Flame },
    { label: "Protein", value: "165g", sub: "Target: 175g", icon: Apple },
    { label: "Readiness", value: "88%", sub: "Optimal recovery", icon: Activity },
    { label: "Streak", value: "Active", sub: "Consistent logging", icon: TrendingUp },
  ];

  return (
    <AppShell title="Today" subtitle="Your daily fitness command center.">
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
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Recent ecosystem activity</p>

        {activityFeed.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No recent activity logged yet. Scan a meal or generate a workout to see it here!</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {activityFeed.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">{item.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
