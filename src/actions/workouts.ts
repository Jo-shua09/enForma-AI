"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

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

// 1. Generate Custom Workout with Gemini 3.6 Flash
export async function generateWorkoutAction(input: { targetMuscle: string; difficulty: string; goal: string }) {
  try {
    const { object } = await generateObject({
      model: google("gemini-3.6-flash"),
      schema: z.object({
        title: z.string().describe("Catchy workout title, e.g. 'Hypertrophy Leg Crusher'"),
        target_muscle: z.string().describe("Primary muscle focus"),
        difficulty: z.string().describe("Difficulty level"),
        exercises: z
          .array(
            z.object({
              name: z.string().describe("Name of the exercise"),
              sets: z.number().describe("Number of sets"),
              reps: z.string().describe("Rep range, e.g. '8-10' or '12'"),
              rest_time: z.string().describe("Rest time, e.g. '90 sec'"),
              note: z.string().describe("Coaching cue or progression note"),
            }),
          )
          .describe("List of exercises for this session"),
      }),
      prompt: `Generate a custom professional bodybuilding/fitness workout session. 
      Target Muscle Group: ${input.targetMuscle}
      Fitness Level / Difficulty: ${input.difficulty}
      Primary Goal: ${input.goal}
      Provide 4 to 6 high-impact exercises with specific sets, reps, rest times, and expert technique notes.`,
    });

    return { success: true, data: object };
  } catch (error: any) {
    console.error("Workout generation failed:", error);
    return { success: false, error: error.message };
  }
}

// 2. Save Workout and Exercises relationally to Supabase
export async function saveWorkoutAction(workoutData: {
  title: string;
  target_muscle: string;
  difficulty: string;
  exercises: Array<{ name: string; sets: number; reps: string; rest_time: string; note: string }>;
}) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Insert into workouts table
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        title: workoutData.title,
        target_muscle: workoutData.target_muscle,
        difficulty: workoutData.difficulty,
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    // Insert exercises into exercises table linked by workout_id
    const exercisesToInsert = workoutData.exercises.map((ex) => ({
      workout_id: workout.id,
      user_id: user.id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      rest_time: `${ex.rest_time} | Note: ${ex.note}`,
    }));

    const { error: exercisesError } = await supabase.from("exercises").insert(exercisesToInsert);

    if (exercisesError) throw exercisesError;

    return { success: true, workout };
  } catch (error: any) {
    console.error("Failed to save workout:", error);
    return { success: false, error: error.message };
  }
}

// 3. Fetch User Workouts with nested exercises
export async function getWorkoutsAction() {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: workouts, error } = await supabase
      .from("workouts")
      .select(
        `
        *,
        exercises (*)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, workouts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 4. Delete Workout
export async function deleteWorkoutAction(workoutId: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from("workouts").delete().eq("id", workoutId);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
