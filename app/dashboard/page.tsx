import Link from "next/link";
import { Activity, Apple, Dumbbell, Flame, ScanLine, TrendingUp, Calendar } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

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
  const { data: profile } = await supabase.from("profiles").select("daily_calories, protein_target, current_plan").eq("id", user.id).single();

  if (!profile?.current_plan || profile.current_plan === "pending") {
    redirect("/pricing");
  }

  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("daily_calories, protein_target").eq("id", user?.id).single();

  const targetCalories = profile?.daily_calories || 2350;
  const targetProtein = profile?.protein_target || 175;

  if (!user) {
    return {
      totalCaloriesToday: 0,
      totalProteinToday: 0,
      targetCalories,
      targetProtein,
      activityFeed: [],
    };
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: todayMeals } = await supabase
    .from("meals")
    .select("calories, protein, food_items, created_at")
    .eq("user_id", user.id)
    .gte("created_at", startOfDay.toISOString());

  const totalCaloriesToday = todayMeals?.reduce((acc, m) => acc + (m.calories || 0), 0) || 0;
  const totalProteinToday = todayMeals?.reduce((acc, m) => acc + (m.protein || 0), 0) || 0;

  const { data: recentMeals } = await supabase
    .from("meals")
    .select("food_items, calories, protein, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: workouts } = await supabase
    .from("workouts")
    .select("title, target_muscle, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2);

  const { data: forms } = await supabase
    .from("form_analysis")
    .select("exercise_name, form_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2);

  const activityFeed: Array<{ title: string; subtitle: string; date: string }> = [];

  recentMeals?.forEach((m) => {
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

  return {
    totalCaloriesToday,
    totalProteinToday,
    targetCalories,
    targetProtein,
    activityFeed,
  };
}

const actions = [
  { to: "/nutrition", label: "Scan a meal", desc: "Photo → macros in 3 seconds", icon: Apple },
  { to: "/workouts", label: "Today's session", desc: "AI custom workout splits", icon: Dumbbell },
  { to: "/form-coach", label: "Check my form", desc: "Camera-based scoring", icon: ScanLine },
] as const;

export default async function DashboardPage() {
  const { totalCaloriesToday, totalProteinToday, targetCalories, targetProtein, activityFeed } = await getDashboardData();

  // Format current date cleanly (e.g. "Monday, Aug 17, 2026")
  const currentDateFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const stats = [
    { label: "Calories today", value: totalCaloriesToday.toLocaleString(), sub: `of ${targetCalories.toLocaleString()} kcal`, icon: Flame },
    { label: "Protein", value: `${totalProteinToday}g`, sub: `of ${targetProtein}g`, icon: Apple },
    { label: "Readiness", value: "88%", sub: "Optimal recovery", icon: Activity },
    { label: "Streak", value: "Active", sub: "Consistent logging", icon: TrendingUp },
  ];

  return (
    <AppShell title={currentDateFormatted} subtitle="Your live daily fitness command center.">
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
          <p className="mt-4 text-sm text-muted-foreground">
            No recent activity logged yet. Scan a meal, save a workout, or analyze your form to see records here!
          </p>
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
