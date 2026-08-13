"use client";

import { useState } from "react";
import { Camera, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { EnFormaLoader } from "@/components/ui/enforma-loader";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Nutrition & meal scanning - EnForma AI",
  description: "Scan meal photos for instant macro estimates and track your daily nutrition.",
  openGraph: {
    title: "Nutrition - EnForma AI",
    description: "Photo-based macro tracking with AI estimates.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const initialMeals = [
  { name: "Greek yoghurt & berries", kcal: 320, p: 28, c: 34, f: 8, time: "07:20" },
  { name: "Chicken rice bowl", kcal: 640, p: 52, c: 71, f: 14, time: "12:45" },
  { name: "Protein shake", kcal: 210, p: 34, c: 9, f: 3, time: "16:10" },
  { name: "Grilled salmon & greens", kcal: 612, p: 44, c: 22, f: 33, time: "19:30" },
];

export default function NutritionPage() {
  const [meals, setMeals] = useState(initialMeals);
  const [scanning, setScanning] = useState(false);

  const totals = meals.reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });

  function scan() {
    setScanning(true);
    setTimeout(() => {
      setMeals((m) => [...m, { name: "Turkey wrap (scanned)", kcal: 430, p: 36, c: 41, f: 12, time: "21:05" }]);
      setScanning(false);
      toast.success("Meal analysed - 430 kcal, 36g protein");
    }, 2200);
  }

  return (
    <AppShell title="Nutrition" subtitle="Demo data · scan a meal to see the AI estimate flow">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Calories", `${totals.kcal}`, "2,350 target"],
          ["Protein", `${totals.p}g`, "175g target"],
          ["Carbs", `${totals.c}g`, "260g target"],
          ["Fat", `${totals.f}g`, "78g target"],
        ].map(([l, v, s]) => (
          <div key={l} className="rounded-2xl border border-border bg-surface/50 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{l}</p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Today's meals</p>
            <button
              onClick={scan}
              disabled={scanning}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60"
            >
              <Camera className="h-3.5 w-3.5" /> Scan a meal
            </button>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {meals.map((m) => (
              <li key={m.name + m.time} className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.p}g P · {m.c}g C · {m.f}g F
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm">{m.kcal} kcal</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{m.time}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => toast("Manual entry is coming soon in this demo.")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Add manually
          </button>
        </div>

        <div className="grid place-items-center rounded-2xl border border-border bg-surface/40 p-6">
          {scanning ? (
            <EnFormaLoader text="Estimating macros..." />
          ) : (
            <div className="text-center">
              <p className="font-display text-lg font-semibold tracking-tight">Scanner idle</p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Point your camera at a plate. EnForma segments each item and returns a macro range with a confidence score.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
