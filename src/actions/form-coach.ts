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

// 1. Analyze video with Gemini 3.6 Flash
export async function analyzeFormAction(formData: FormData) {
  try {
    const file = formData.get("video") as File;
    const exerciseName = (formData.get("exercise_name") as string) || "Back Squat";
    if (!file) throw new Error("No video provided");

    const buffer = await file.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString("base64");

    const { object } = await generateObject({
      model: google("gemini-3.6-flash"),
      schema: z.object({
        overall_score: z.number().describe("Overall technique score out of 100"),
        cues: z
          .array(
            z.object({
              label: z.string().describe("Form metric, e.g. 'Depth', 'Knee tracking', 'Bar path', 'Tempo'"),
              score: z.number().describe("Score out of 100 for this specific metric"),
              note: z.string().describe("Specific biomechanical feedback or correction tip"),
            }),
          )
          .describe("Breakdown of 3 to 4 core form metrics"),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this workout video for the exercise: ${exerciseName}. Evaluate technique, range of motion, stability, and posture. Provide an overall score out of 100 and a detailed breakdown of specific technique cues.`,
            },
            {
              type: "file",
              data: base64Video,
              mediaType: file.type && file.type.startsWith("video/") ? file.type : "video/mp4",
            },
          ],
        },
      ],
    });

    // Save to Supabase database & storage
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const fileName = `${user.id}-${Date.now()}.${file.name.split(".").pop()}`;

      await supabase.storage
        .from("form-videos")
        .upload(fileName, file)
        .catch(() => {});

      await supabase.from("form_analysis").insert({
        user_id: user.id,
        exercise_name: exerciseName,
        form_score: object.overall_score,
        feedback_notes: JSON.stringify(object.cues),
      });
    }

    return { success: true, data: object };
  } catch (error: any) {
    console.error("Form analysis failed:", error);
    return { success: false, error: error.message };
  }
}
