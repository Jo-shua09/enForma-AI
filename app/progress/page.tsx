"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { getUnifiedAnalyticsAction, logProgressAction } from "@/actions/progress";
import { Loader2, Plus, TrendingUp, Utensils, Dumbbell, ShieldCheck, Flame } from "lucide-react";

export default function ProgressPage() {
  const [weights, setWeights] = useState<number[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    stats: { totalMealsLogged: 0, avgCalories: 0, totalWorkoutsCompleted: 0, avgFormScore: 0, recentForms: [], recentWorkouts: [] },
    weightLogs: [],
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const res = await getUnifiedAnalyticsAction();
    if (res.success && res.data) {
      setAnalytics(res.data);
      const dbWeights = res.data.weightLogs.map((log: any) => Number(log.weight));
      setWeights(dbWeights);
    }
    setLoading(false);
  }

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Saving check-in...");

    const formData = new FormData();
    formData.append("weight", newWeight);
    formData.append("notes", notes);

    const res = await logProgressAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Weight logged successfully!", { id: toastId });
      setNewWeight("");
      setNotes("");
      loadData();
    } else {
      toast.error(res.error || "Failed to save check-in.", { id: toastId });
    }
  };

  const max = weights.length > 0 ? Math.max(...weights) : 100;
  const min = weights.length > 0 ? Math.min(...weights) : 0;
  const currentWeight = weights.length > 0 ? weights[weights.length - 1] : 0;
  const initialWeight = weights.length > 0 ? weights[0] : 0;
  const weightDiff = (currentWeight - initialWeight).toFixed(1);

  return (
    <AppShell title="Progress & Ecosystem Analytics" subtitle="Unified analytics for meals, workouts, form, and body metrics.">
      {/* TOP ROW: Ecosystem Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-3xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Utensils className="h-4 w-4 text-cyan" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Scanned Meals</span>
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight">{analytics.stats.totalMealsLogged}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Avg {analytics.stats.avgCalories} kcal per meal</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Dumbbell className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Workouts Logged</span>
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight">{analytics.stats.totalWorkoutsCompleted}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Custom splits saved</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <ShieldCheck className="h-4 w-4 text-cyan" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Avg Form Score</span>
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight">
            {analytics.stats.avgFormScore > 0 ? `${analytics.stats.avgFormScore}/100` : "N/A"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">AI video evaluations</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Current Weight</span>
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight">{currentWeight > 0 ? `${currentWeight} kg` : "-- kg"}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active body metric</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Body Weight Chart & Logger */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Body weight trend</p>

            {weights.length === 0 ? (
              <p className="mt-2 font-display text-lg text-muted-foreground">No check-ins logged yet</p>
            ) : (
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
                {currentWeight} kg{" "}
                <span className={`text-sm font-normal ${Number(weightDiff) <= 0 ? "text-accent" : "text-orange-400"}`}>
                  {Number(weightDiff) > 0 ? `+${weightDiff}` : weightDiff} kg
                </span>
              </p>
            )}

            <div className="mt-6 flex h-48 items-end gap-2">
              {weights.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  Chart will populate after your first check-in
                </div>
              ) : (
                weights.map((w, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-cyan/70 transition-all hover:bg-cyan"
                    style={{ height: `${((w - min) / (max - min || 1)) * 80 + 20}%` }}
                    title={`${w} kg`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Quick Check-in Logger Form */}
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground mb-4">Log Today's Weight</h3>
            <form onSubmit={handleLogWeight} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Weight in kg (e.g. 78.5)"
                  className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                  required
                />
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note (e.g. Morning check-in)"
                  className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Check-in
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Ecosystem Activity (Workouts & Form Coach) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Form Coach Recent Scores */}
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-4">Recent Form Analyses</p>
            {analytics.stats.recentForms.length === 0 ? (
              <p className="text-xs text-muted-foreground">No video analyses recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics.stats.recentForms.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between rounded-2xl border border-border bg-background/50 p-3.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{f.exercise_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-cyan">{f.form_score}/100</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workout Splits Summary */}
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-4">Recent Training Splits</p>
            {analytics.stats.recentWorkouts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No workouts generated or saved yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics.stats.recentWorkouts.map((w: any) => (
                  <div key={w.id} className="rounded-2xl border border-border bg-background/50 p-3.5">
                    <p className="text-sm font-medium text-foreground">{w.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {w.target_muscle} · {w.difficulty}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
