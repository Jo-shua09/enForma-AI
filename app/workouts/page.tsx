"use client";

import { useState, useEffect } from "react";
import { Check, Dumbbell, Loader2, Play, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { generateWorkoutAction, getWorkoutsAction, saveWorkoutAction, deleteWorkoutAction } from "@/actions/workouts";

type Exercise = {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  rest_time: string;
};

type Workout = {
  id: string;
  title: string;
  target_muscle: string;
  difficulty: string;
  created_at: string;
  exercises: Exercise[];
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // Generator states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [targetMuscle, setTargetMuscle] = useState("Chest & Triceps");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [goal, setGoal] = useState("Hypertrophy");
  const [generatedSession, setGeneratedSession] = useState<any | null>(null);

  // Load workouts on mount
  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    const res = await getWorkoutsAction();
    if (res.success && res.workouts) {
      setWorkouts(res.workouts);
      if (res.workouts.length > 0 && !activeWorkout) {
        setActiveWorkout(res.workouts[0]);
      }
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const toastId = toast.loading("Gemini is designing your workout split...");

    const res = await generateWorkoutAction({ targetMuscle, difficulty, goal });
    setIsGenerating(false);

    if (res.success && res.data) {
      setGeneratedSession(res.data);
      toast.success("Workout plan generated!", { id: toastId });
    } else {
      toast.error(res.error || "Failed to generate workout.", { id: toastId });
    }
  };

  const handleSaveAIWorkout = async () => {
    if (!generatedSession) return;
    setIsSaving(true);
    const toastId = toast.loading("Saving routine to database...");

    const res = await saveWorkoutAction(generatedSession);
    setIsSaving(false);

    if (res.success && res.workout) {
      toast.success("Workout saved successfully!", { id: toastId });
      setGeneratedSession(null);
      await loadWorkouts();
      setActiveWorkout(res.workout);
    } else {
      toast.error(res.error || "Failed to save workout.", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting workout...");
    const res = await deleteWorkoutAction(id);
    if (res.success) {
      toast.success("Workout deleted.", { id: toastId });
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      if (activeWorkout?.id === id) {
        setActiveWorkout(workouts.find((w) => w.id !== id) || null);
      }
    } else {
      toast.error("Failed to delete workout.", { id: toastId });
    }
  };

  return (
    <AppShell title="Workouts" subtitle="AI-powered custom training splits & progression tracker.">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: AI Generator & Saved History */}
        <div className="space-y-6 lg:col-span-5">
          {/* AI Generator Box */}
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-cyan" />
              <h2 className="font-display text-base font-semibold tracking-tight text-foreground">AI Workout Generator</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Target Muscle / Split</label>
                <input
                  type="text"
                  value={targetMuscle}
                  onChange={(e) => setTargetMuscle(e.target.value)}
                  placeholder="e.g. Leg Day, Pull, Chest & Shoulders"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                  >
                    <option value="Hypertrophy">Hypertrophy</option>
                    <option value="Strength">Strength</option>
                    <option value="Endurance">Endurance</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Workout Routine
              </button>
            </form>

            {/* Generated Preview Card */}
            {generatedSession && (
              <div className="mt-6 rounded-2xl border border-cyan/40 bg-background p-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{generatedSession.title}</h3>
                  <button onClick={() => setGeneratedSession(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {generatedSession.target_muscle} · {generatedSession.difficulty}
                </p>

                <div className="space-y-2 mb-4">
                  {generatedSession.exercises.map((ex: any, idx: number) => (
                    <div key={idx} className="text-xs bg-surface-2/50 p-2 rounded-lg">
                      <span className="font-medium text-foreground">{ex.name}</span> — {ex.sets} sets × {ex.reps}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveAIWorkout}
                  disabled={isSaving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-xs font-medium text-background transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save to My Workouts
                </button>
              </div>
            )}
          </div>

          {/* Saved Workouts List */}
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <h2 className="font-display text-base font-semibold tracking-tight text-foreground mb-4">My Routines</h2>

            {workouts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No saved routines yet. Generate one above!</p>
            ) : (
              <div className="space-y-3">
                {workouts.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setActiveWorkout(w)}
                    className={`group relative flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                      activeWorkout?.id === w.id
                        ? "border-cyan/50 bg-surface-2/80 shadow-sm"
                        : "border-border bg-background/50 hover:border-border/80"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{w.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {w.target_muscle} · {w.difficulty}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(w.id);
                      }}
                      className="absolute right-3 top-3 hidden h-7 w-7 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground group-hover:grid md:grid"
                      title="Delete workout"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Workout Session Tracker */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-surface/40 p-6 min-h-[500px]">
            {!activeWorkout ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <Dumbbell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">Select a workout routine or generate one to begin tracking.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-border pb-5 mb-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Active Routine</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">{activeWorkout.title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activeWorkout.target_muscle} · {activeWorkout.difficulty}
                    </p>
                  </div>
                  <button
                    onClick={() => toast.success("Session started - timer running!")}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105"
                  >
                    <Play className="h-3.5 w-3.5" /> Start session
                  </button>
                </div>

                <ul className="divide-y divide-border">
                  {activeWorkout.exercises?.map((ex, idx) => {
                    const isDone = completedExercises.includes(ex.name);
                    return (
                      <li key={ex.id || idx} className="flex items-center justify-between gap-4 py-4">
                        <div>
                          <p className={`text-sm font-medium ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{ex.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {ex.sets} sets × {ex.reps} · {ex.rest_time}
                          </p>
                        </div>
                        <button
                          onClick={() => setCompletedExercises((d) => (d.includes(ex.name) ? d.filter((x) => x !== ex.name) : [...d, ex.name]))}
                          className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                            isDone ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                          aria-label={`Mark ${ex.name} complete`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
