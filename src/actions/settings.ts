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

export async function updateGoalsAction(formData: FormData) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const daily_calories = parseInt(formData.get("daily_calories") as string) || 2350;
    const protein_target = parseInt(formData.get("protein_target") as string) || 175;
    const training_days = parseInt(formData.get("training_days") as string) || 5;
    const water_goal = parseFloat(formData.get("water_goal") as string) || 3.0;

    // Update profiles table or user_goals table
    const { error } = await supabase
      .from("profiles")
      .update({
        daily_calories,
        protein_target,
        training_days,
        water_goal,
      })
      .eq("id", user.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update goals:", error);
    return { success: false, error: error.message };
  }
}
