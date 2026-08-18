"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { EnFormaLoader } from "@/components/ui/enforma-loader";
import { Upload, Sparkles, Activity, Dumbbell } from "lucide-react";
import { analyzeFormAction } from "@/actions/form-coach";

type Cue = {
  label: string;
  score: number;
  note: string;
};

const commonExercises = ["Back Squat", "Push-up", "Bench Press", "Deadlift", "Overhead Press", "Barbell Row", "Pull-up", "Lunges"];

export default function FormCoachPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysing, setAnalysing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>(
    "https://assets.mixkit.co/videos/preview/mixkit-man-doing-squats-with-a-barbell-in-a-gym-41656-large.mp4",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exerciseName, setExerciseName] = useState("Back Squat");

  const [analysisData, setAnalysisData] = useState<{ overall_score: number; cues: Cue[] } | null>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setAnalysisData(null);
  };

  const handleRunAnalysis = async () => {
    setAnalysing(true);
    const toastId = toast.loading(`Gemini is analyzing your ${exerciseName} biomechanics...`);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("video", selectedFile);
    } else {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        formData.append("video", new File([blob], "demo-lift.mp4", { type: "video/mp4" }));
      } catch (err) {
        setAnalysing(false);
        toast.error("Failed to load video clip for analysis.", { id: toastId });
        return;
      }
    }
    formData.append("exercise_name", exerciseName);

    const res = await analyzeFormAction(formData);
    setAnalysing(false);

    if (res.success && res.data) {
      setAnalysisData(res.data);
      toast.success(`Analysis complete - Score: ${res.data.overall_score}/100`, { id: toastId });
    } else {
      toast.error(res.error || "Analysis failed. Try a shorter video clip.", { id: toastId });
    }
  };

  return (
    <AppShell title="Form Coach" subtitle="AI video analysis & real-time skeletal tracking.">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left Column: Video Player & Controls */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface/40">
            {/* Exercise Selector Bar */}
            <div className="flex items-center justify-between border-b border-border bg-background/60 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-cyan" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Exercise</span>
              </div>
              <select
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-cyan/50"
              >
                {commonExercises.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative aspect-video w-full bg-background">
              <video key={videoUrl} className="h-full w-full object-cover" src={videoUrl} autoPlay loop muted playsInline />

              {analysing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
                  <EnFormaLoader text="Tracking 33 skeletal joints..." />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-5">
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight">
                  {analysisData ? `${analysisData.overall_score}/100` : "-- / 100"}
                </p>
                <p className="text-xs text-muted-foreground">Overall technique score ({exerciseName})</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-2/70"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Clip
                </button>
                <input type="file" ref={fileInputRef} onChange={handleVideoSelect} accept="video/*" className="hidden" />

                <button
                  onClick={handleRunAnalysis}
                  disabled={analysing}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105 disabled:opacity-60"
                >
                  <Sparkles className="h-3.5 w-3.5 text-cyan" /> {analysisData ? "Re-analyze Video" : "Analyze Video"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown & Cues */}
        <div className="rounded-3xl border border-border bg-surface/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Biomechanical Breakdown</p>
              {/* <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Supabase Synced
              </span> */}
            </div>

            {!analysisData ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Activity className="h-10 w-10 text-muted-foreground/30 mb-3 animate-pulse" />
                <p className="text-sm font-medium text-foreground">No analysis generated yet</p>
                <p className="text-xs text-muted-foreground mt-1">Select an exercise, upload a clip, and click "Analyze Video".</p>
              </div>
            ) : (
              <ul className="space-y-5 animate-in fade-in duration-500">
                {analysisData.cues.map((c) => (
                  <li key={c.label} className="rounded-2xl border border-border/60 bg-background/40 p-3.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="font-mono text-xs font-semibold text-cyan">{c.score}/100</span>
                    </div>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-cyan transition-all duration-700" style={{ width: `${c.score}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{c.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
