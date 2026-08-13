"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Droplets, Footprints, Moon, TrendingUp } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const week = [
  { day: "Mon", focus: "Chest + Triceps", volume: 18 },
  { day: "Tue", focus: "Back + Biceps", volume: 20 },
  { day: "Wed", focus: "Mobility / Zone 2", volume: 6 },
  { day: "Thu", focus: "Legs + Core", volume: 22 },
  { day: "Fri", focus: "Shoulders + Arms", volume: 16 },
  { day: "Sat", focus: "Full body power", volume: 14 },
  { day: "Sun", focus: "Rest", volume: 0 },
];

const monday = [
  { name: "Bench Press", scheme: "4 × 8", load: "60 → 62.5 kg", up: true },
  { name: "Incline Dumbbell Press", scheme: "3 × 10", load: "22.5 kg", up: false },
  { name: "Cable Fly", scheme: "3 × 12", load: "15 kg", up: true },
  { name: "Tricep Pushdown", scheme: "3 × 12", load: "30 kg", up: false },
  { name: "Overhead Extension", scheme: "2 × 15", load: "18 kg", up: true },
];

const habits = [
  { icon: Droplets, label: "Water", value: "2.4 / 3.0 L", pct: 80, color: "var(--cyan)" },
  { icon: Footprints, label: "Steps", value: "9,410 / 10k", pct: 94, color: "var(--lime)" },
  { icon: Moon, label: "Sleep", value: "7h 12m", pct: 90, color: "var(--chart-3)" },
  { icon: CalendarDays, label: "Training", value: "4 / 5 sessions", pct: 80, color: "var(--chart-4)" },
];

export function WorkoutPlanner() {
  return (
    <Section id="workouts">
      <SectionHeading
        label="AI workout planner"
        title={
          <>
            A split that <span className="text-gradient">rewrites itself.</span>
          </>
        }
        description="Tell it your goal, experience level, equipment and how many days you can realistically train. It builds the week - then adjusts loads from every set you log."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="h-full rounded-3xl border border-border bg-surface/50 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">This week · hypertrophy block 2</p>
            <div className="mt-5 space-y-2">
              {week.map((d) => (
                <div key={d.day} className="flex items-center gap-4 rounded-xl border border-border bg-background/50 px-4 py-3">
                  <span className="w-9 font-mono text-xs uppercase text-muted-foreground">{d.day}</span>
                  <span className="flex-1 text-sm">{d.focus}</span>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(d.volume / 22) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "var(--gradient-accent)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="h-full rounded-3xl border border-border bg-surface/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight">Monday - Chest + Triceps</h3>
                <p className="mt-1 text-xs text-muted-foreground">52 min · 18 working sets · RPE 8 cap</p>
              </div>
              <span className="rounded-full border border-cyan/40 bg-cyan-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
                auto-generated
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              {monday.map((e, i) => (
                <div
                  key={e.name}
                  className={`flex items-center justify-between gap-4 px-4 py-3.5 text-sm ${i % 2 ? "bg-background/40" : "bg-background/20"}`}
                >
                  <span className="flex-1 font-medium">{e.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{e.scheme}</span>
                  <span className={`inline-flex items-center gap-1 font-mono text-xs ${e.up ? "text-accent" : "text-muted-foreground"}`}>
                    {e.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
                    {e.load}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/25 bg-lime-soft p-5">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-foreground/90">
                <span className="font-medium">Progression suggested:</span> increase your bench press from 60kg → 62.5kg next session. Last three
                sessions closed at RPE 7.5 with all reps completed.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {habits.map((h, i) => (
          <Reveal key={h.label} delay={i * 0.06}>
            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <div className="flex items-center justify-between">
                <h.icon className="h-4 w-4 text-cyan" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{h.pct}%</span>
              </div>
              <p className="mt-4 font-display text-lg font-semibold">{h.value}</p>
              <p className="text-xs text-muted-foreground">{h.label}</p>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${h.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: h.color }}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
