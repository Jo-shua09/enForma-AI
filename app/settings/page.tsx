"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { useAuth } from "@/lib/auth";
import { updatePlanAction } from "@/actions/auth";
import { PricingStep } from "@/auth/pricing-step";

export default function SettingsPage() {
  const { user, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<"details" | "pricing">("details");

  const handlePlanSelected = async (planName: string) => {
    const toastId = toast.loading("Updating your plan...");
    const res = await updatePlanAction(planName.toLowerCase());

    if (res.success) {
      await refreshUser(); // Refreshes client-side context instantly
      toast.success(`Your plan has been updated to ${planName}!`, { id: toastId });
      setView("details"); // Flips back to the settings view showing the new plan
    } else {
      toast.error(res.error || "Failed to update plan. Please try again.", { id: toastId });
    }
  };

  return (
    <AppShell title="Settings" subtitle="Manage your EnForma AI profile, goals and preferences.">
      {view === "details" ? (
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
              {[
                ["Daily calories", "2,350 kcal"],
                ["Protein target", "175 g"],
                ["Training days", "5 per week"],
                ["Water goal", "3.0 L"],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => toast("Goal editing is coming soon in this demo.")}
              className="mt-6 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
            >
              Edit goals
            </button>
          </div>
        </div>
      ) : (
        <PricingStep onPlanSelect={handlePlanSelected} onBack={() => setView("details")} />
      )}
    </AppShell>
  );
}
