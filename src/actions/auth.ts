"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function signInAction(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function signUpAction(name: string, email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.session) {
    // This is required to set the session cookie
  }

  return { success: true };
}

export async function updatePlanAction(planName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not logged in" };
  }

  const { error } = await supabase.from("profiles").update({ current_plan: planName }).eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath("/dashboard");
  return { success: true };
}
