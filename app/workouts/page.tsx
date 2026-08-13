"use client";

import { useState } from "react";
import { Check, Play } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";

const metadata = {
  title: "Workouts & adaptive plans",
  description: "Your adaptive weekly training split with AI progression suggestions.",
  openGraph: {
    description: "Adaptive weekly training split, AI progression.",
  },
};

const week = [
  { day: "Mon", name: "Push A", focus: "Chest · Shoulders · Triceps", mins: 52, done: true },
  { day: "Tue", name: "Pull A", focus: "Back · Biceps", mins: 48, done: true },
  { day: "Wed", name: "Legs A", focus: "Quads · Glutes", mins: 57, done: false },
  { day: "Thu", name: "Recovery", focus: "Zone 2 · Mobility", mins: 35, done: false },
  { day: "Fri", name: "Push B", focus: "Incline emphasis", mins: 50, done: false },
  { day: "Sat", name: "Pull B", focus: "Vertical pulling", mins: 46, done: false },
  { day: "Sun", name: "Rest", focus: "Full recovery", mins: 0, done: false },
];

const session = [
  { ex: "Back squat", sets: "4 × 6", load: "102.5 kg", note: "+2.5kg from last week" },
  { ex: "Romanian deadlift", sets: "3 × 8", load: "85 kg", note: "Hold tempo 3-1-1" },
  { ex: "Bulgarian split squat", sets: "3 × 10", load: "22 kg DB", note: "Left side lagging" },
  { ex: "Leg curl", sets: "3 × 12", load: "45 kg", note: "Same as last week" },
  { ex: "Standing calf raise", sets: "4 × 15", load: "70 kg", note: "Pause at bottom" },
];

export default function WorkoutsPage() {
  const [done, setDone] = useState<string[]>([]);

  return (
    <AppShell title="Workouts" subtitle="Hypertrophy block · week 4 of 6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">This week</p>
          <ul className="mt-4 space-y-2">
            {week.map((w) => (
              <li key={w.day} className="flex items-center justify-between rounded-xl border border-border bg-surface-2/40 px-4 py-3">
                <div>
                  <p className="text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{w.day}</span> · {w.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{w.focus}</p>
                </div>
                <span className={`font-mono text-[11px] ${w.done ? "text-accent" : "text-muted-foreground"}`}>
                  {w.done ? "Done" : w.mins ? `${w.mins} min` : "-"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Today · Legs A</p>
              <p className="mt-1 font-display text-xl font-semibold tracking-tight">5 exercises · 57 min</p>
            </div>
            <button
              onClick={() => toast.success("Session started - timer running.")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
            >
              <Play className="h-3.5 w-3.5" /> Start session
            </button>
          </div>

          <ul className="mt-5 divide-y divide-border">
            {session.map((s) => {
              const isDone = done.includes(s.ex);
              return (
                <li key={s.ex} className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className={`text-sm ${isDone ? "text-muted-foreground line-through" : ""}`}>{s.ex}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.sets} · {s.load} · {s.note}
                    </p>
                  </div>
                  <button
                    onClick={() => setDone((d) => (d.includes(s.ex) ? d.filter((x) => x !== s.ex) : [...d, s.ex]))}
                    className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                      isDone ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label={`Mark ${s.ex} complete`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
