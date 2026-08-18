"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { useAuth } from "@/lib/auth";
import { updatePlanAction } from "@/actions/auth";
import { updateGoalsAction } from "@/actions/settings";
import { PricingStep } from "@/auth/pricing-step";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<"details" | "pricing" | "edit-goals">("details");
  const [isSavingGoals, setIsSavingGoals] = useState(false);

  // Goal form states (defaulting to user profile or defaults)
  const [calories, setCalories] = useState(user?.daily_calories || 2350);
  const [protein, setProtein] = useState(user?.protein_target || 175);
  const [trainingDays, setTrainingDays] = useState(user?.training_days || 5);
  const [water, setWater] = useState(user?.water_goal || 3.0);

  const handlePlanSelected = async (planName: string) => {
    const toastId = toast.loading("Updating your plan...");
    const res = await updatePlanAction(planName.toLowerCase());

    if (res.success) {
      await refreshUser();
      toast.success(`Your plan has been updated to ${planName}!`, { id: toastId });
      setView("details");
    } else {
      toast.error(res.error || "Failed to update plan. Please try again.", { id: toastId });
    }
  };

  const handleSaveGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGoals(true);
    const toastId = toast.loading("Saving your targets...");

    const formData = new FormData();
    formData.append("daily_calories", calories.toString());
    formData.append("protein_target", protein.toString());
    formData.append("training_days", trainingDays.toString());
    formData.append("water_goal", water.toString());

    const res = await updateGoalsAction(formData);
    setIsSavingGoals(false);

    if (res.success) {
      await refreshUser();
      toast.success("Goals updated successfully!", { id: toastId });
      setView("details");
    } else {
      toast.error(res.error || "Failed to update goals.", { id: toastId });
    }
  };

  return (
    <AppShell title="Settings" subtitle="Manage your EnForma AI profile, goals and preferences.">
      {view === "pricing" ? (
        <PricingStep onPlanSelect={handlePlanSelected} onBack={() => setView("details")} />
      ) : view === "edit-goals" ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Edit Fitness Targets</p>
          <form onSubmit={handleSaveGoals} className="mt-5 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Protein Target (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Training Days Per Week</label>
              <input
                type="number"
                value={trainingDays}
                onChange={(e) => setTrainingDays(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Daily Water Goal (L)</label>
              <input
                type="number"
                step="0.1"
                value={water}
                onChange={(e) => setWater(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-cyan/50"
                required
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setView("details")}
                className="rounded-xl border border-border bg-surface-2 px-4 py-2 text-xs text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingGoals}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
              >
                {isSavingGoals && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Goals
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface/40 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Profile</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="capitalize">{user?.full_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>{user?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="capitalize text-cyan">{user?.current_plan ?? "No Plan"}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                className="rounded-xl border border-border bg-surface-2 px-4 py-2 text-xs"
              >
                Sign out
              </button>
              <button onClick={() => setView("pricing")} className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
                Change plan
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/40 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Goals</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Daily calories</span>
                <span>{user?.daily_calories ?? 2350} kcal</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Protein target</span>
                <span>{user?.protein_target ?? 175} g</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Training days</span>
                <span>{user?.training_days ?? 5} per week</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Water goal</span>
                <span>{user?.water_goal ?? 3.0} L</span>
              </li>
            </ul>
            <button
              onClick={() => setView("edit-goals")}
              className="mt-6 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
            >
              Edit goals
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
