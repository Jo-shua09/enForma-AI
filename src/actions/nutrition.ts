"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

// Helper to reliably grab the Supabase Server Client
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

// 1. Analyze the image with Gemini (No database writing yet)
export async function analyzeMealAction(formData: FormData) {
  try {
    const file = formData.get("image") as File;
    if (!file) throw new Error("No image provided");

    // Convert the image to a Base64 string to ensure stable network transmission
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Call Gemini 3.6 Flash and force a strict JSON output using Zod
    const { object } = await generateObject({
      model: google("gemini-3.6-flash"),
      schema: z.object({
        food_items: z.array(z.string()).describe("A list of the main food items visible on the plate."),
        calories: z.number().describe("Estimated total calories of the entire meal."),
        protein: z.number().describe("Estimated total protein in grams."),
        carbs: z.number().describe("Estimated total carbohydrates in grams."),
        fats: z.number().describe("Estimated total fats in grams."),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this meal. Identify the food items and estimate the total calories, protein, carbs, and fats.",
            },
            {
              type: "file",
              data: base64Image,
              mediaType: file.type || "image/jpeg",
            },
          ],
        },
      ],
    });

    return { success: true, data: object };
  } catch (error: any) {
    console.error("AI Analysis failed:", error);
    return { success: false, error: error.message };
  }
}

// 2. Upload image and save data to Supabase
export async function saveMealAction(formData: FormData) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const file = formData.get("image") as File;
    const macros = JSON.parse(formData.get("macros") as string);

    // Upload image to the 'meal-photos' bucket
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("meal-photos").upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get the public URL for the UI
    const {
      data: { publicUrl },
    } = supabase.storage.from("meal-photos").getPublicUrl(fileName);

    // Insert the record into the 'meals' table
    const { data: meal, error: dbError } = await supabase
      .from("meals")
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        food_items: macros.food_items,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fats: macros.fats,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return { success: true, meal };
  } catch (error: any) {
    console.error("Failed to save meal:", error);
    return { success: false, error: error.message };
  }
}

// 3. Fetch user's meal history
export async function getRecentMealsAction() {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: meals, error } = await supabase.from("meals").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, meals };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 4. Delete a meal
export async function deleteMealAction(id: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from("meals").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
