"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { EnFormaLoader } from "@/components/ui/enforma-loader";
import formVideo from "@/assets/form-coach.mp4.asset.json";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Form Coach - camera-based lift analysis | EnForma AI",
  description: "Grade your lifting technique in real time with on-device pose tracking.",
  openGraph: {
    title: "Form Coach - EnForma AI",
    description: "Real-time technique scoring from your camera.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const cues = [
  { label: "Depth", score: 92, note: "Hips below parallel on every rep" },
  { label: "Knee tracking", score: 78, note: "Slight left valgus on reps 4–6" },
  { label: "Bar path", score: 88, note: "Within 3cm of vertical" },
  { label: "Tempo", score: 71, note: "Eccentric rushing under fatigue" },
];

export default function FormCoachPage() {
  const [analysing, setAnalysing] = useState(false);

  return (
    <AppShell title="Form Coach" subtitle="Back squat · last recorded set · demo analysis">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
          <video className="aspect-video w-full object-cover" src={formVideo.url} autoPlay loop muted playsInline />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-5">
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">84/100</p>
              <p className="text-xs text-muted-foreground">Overall technique score</p>
            </div>
            <button
              onClick={() => {
                setAnalysing(true);
                setTimeout(() => {
                  setAnalysing(false);
                  toast.success("Re-analysis complete - score improved to 86/100");
                }, 2200);
              }}
              disabled={analysing}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60"
            >
              Re-analyse set
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          {analysing ? (
            <div className="grid h-full place-items-center">
              <EnFormaLoader text="Tracking 33 joints..." />
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Breakdown</p>
              <ul className="mt-4 space-y-4">
                {cues.map((c) => (
                  <li key={c.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{c.label}</span>
                      <span className="font-mono text-xs text-cyan">{c.score}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-cyan" style={{ width: `${c.score}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{c.note}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
