"use client";

import { Camera, Dumbbell, Flame, LineChart, ScanLine, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const features = [
  {
    icon: ScanLine,
    title: "Meal photo → macros",
    body: "Snap a plate. Vision models detect every item, estimate portions and return calories, protein, carbs and fat with a confidence band.",
  },
  {
    icon: Dumbbell,
    title: "Adaptive workout planner",
    body: "Goals, equipment, days per week and session length in - a periodised split out, rewritten every week from your logged sets.",
  },
  {
    icon: Camera,
    title: "Camera form analysis",
    body: "Squat, push-up, curl, press and deadlift. Joint tracking scores depth, knee tracking, torso angle and tempo in real time.",
  },
  {
    icon: Flame,
    title: "Habit streaks",
    body: "Water, steps, sleep, protein and training. Simple rings, honest streaks, zero guilt-tripping notifications.",
  },
  {
    icon: LineChart,
    title: "Progression intelligence",
    body: '"Bench 60kg → 62.5kg next session." Load suggestions derived from RPE, bar speed trend and completed volume.',
  },
  {
    icon: ShieldCheck,
    title: "Honest estimates",
    body: "Nutrition numbers are shown as ranges, never fake precision. You always see how confident the model is.",
  },
  {
    icon: Smartphone,
    title: "Offline-first logging",
    body: "Log sets in a dead-zone basement gym. Everything syncs the moment you get signal back.",
  },
  {
    icon: Sparkles,
    title: "Coach chat",
    body: 'Ask "why is my bench stalling?" and get an answer grounded in your last 12 weeks of real data.',
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        label="The system"
        title={
          <>
            Four engines. <span className="text-gradient">One coach.</span>
          </>
        }
        description="Everything a good human coach does - nutrition, programming, technique and accountability - running quietly in the background of your day."
      />

      <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <div className="group h-full bg-surface/50 p-7 transition-colors hover:bg-surface-2/70">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background/60">
                <f.icon className="h-4.5 w-4.5 text-cyan" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
