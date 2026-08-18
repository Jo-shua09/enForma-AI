"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {}
      },
    },
  });
}

// 1. Fetch aggregated stats across ALL modules (Progress, Meals, Workouts, Form Coach)
export async function getUnifiedAnalyticsAction() {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Fetch Weight Logs
    const { data: metrics } = await supabase.from("progress_metrics").select("*").eq("user_id", user.id).order("recorded_at", { ascending: true });

    // Fetch Scanned Meals (Macros & Calories)
    const { data: meals } = await supabase.from("meals").select("*").eq("user_id", user.id);

    // Fetch Workouts
    const { data: workouts } = await supabase.from("workouts").select("*, exercises (*)").eq("user_id", user.id);

    // Fetch Form Analyses
    const { data: formLogs } = await supabase.from("form_analysis").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

    // Calculate aggregated metrics
    const totalMealsLogged = meals?.length || 0;
    const avgCalories = totalMealsLogged > 0 ? Math.round(meals.reduce((acc, m) => acc + (m.calories || 0), 0) / totalMealsLogged) : 0;

    const totalWorkoutsCompleted = workouts?.length || 0;

    const avgFormScore =
      formLogs && formLogs.length > 0 ? Math.round(formLogs.reduce((acc, f) => acc + (f.form_score || 0), 0) / formLogs.length) : 0;

    return {
      success: true,
      data: {
        weightLogs: metrics || [],
        stats: {
          totalMealsLogged,
          avgCalories,
          totalWorkoutsCompleted,
          avgFormScore,
          recentForms: formLogs?.slice(0, 3) || [],
          recentWorkouts: workouts?.slice(0, 3) || [],
        },
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 2. Log a new weight check-in entry
export async function logProgressAction(formData: FormData) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const weight = parseFloat(formData.get("weight") as string);
    const notes = (formData.get("notes") as string) || "";

    const { data, error } = await supabase
      .from("progress_metrics")
      .insert({
        user_id: user.id,
        weight,
        notes,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to log progress:", error);
    return { success: false, error: error.message };
  }
}
