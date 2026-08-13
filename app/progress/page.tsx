import { AppShell } from "@/components/app/app-shell";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Progress & trends - EnForma AI",
  description: "Body-weight trends, strength progression and habit consistency over time.",
  openGraph: {
    title: "Progress - EnForma AI",
    description: "Strength, body-weight and habit trends.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const weights = [82.4, 82.1, 81.7, 81.8, 81.2, 80.9, 80.4, 80.1, 79.6, 79.4, 79.0, 78.6];
const lifts = [
  { name: "Back squat", start: 85, now: 102.5 },
  { name: "Bench press", start: 62.5, now: 75 },
  { name: "Deadlift", start: 110, now: 135 },
  { name: "Overhead press", start: 40, now: 47.5 },
];

export default function ProgressPage() {
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  return (
    <AppShell title="Progress" subtitle="Last 12 weeks · demo data">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Body weight</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            78.6 kg <span className="text-sm font-normal text-accent">−3.8 kg</span>
          </p>
          <div className="mt-6 flex h-40 items-end gap-2">
            {weights.map((w, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-cyan/70"
                style={{ height: `${((w - min) / (max - min || 1)) * 80 + 20}%` }}
                title={`${w} kg`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Strength progression</p>
          <ul className="mt-4 space-y-4">
            {lifts.map((l) => (
              <li key={l.name}>
                <div className="flex items-center justify-between text-sm">
                  <span>{l.name}</span>
                  <span className="font-mono text-xs text-accent">+{Math.round(((l.now - l.start) / l.start) * 100)}%</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {l.start} kg → {l.now} kg
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
