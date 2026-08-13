"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Gauge, Info, Upload } from "lucide-react";
import { EnFormaLoader } from "@/components/ui/enforma-loader";
import { Reveal, Section, SectionHeading } from "./primitives";

const meals = [
  {
    id: "chicken",
    name: "Chicken, jasmine rice & greens",
    kcal: 680,
    range: "±90 kcal",
    confidence: 92,
    items: ["Grilled chicken breast ~180g", "Jasmine rice ~1.5 cups", "Broccoli & green beans ~120g"],
    macros: { protein: 42, carbs: 72, fat: 18 },
    tag: "Lunch",
  },
  {
    id: "bowl",
    name: "Salmon poke bowl",
    kcal: 745,
    range: "±110 kcal",
    confidence: 87,
    items: ["Raw salmon ~150g", "Sushi rice ~1.2 cups", "Avocado ½", "Edamame ~60g"],
    macros: { protein: 38, carbs: 68, fat: 29 },
    tag: "Dinner",
  },
  {
    id: "oats",
    name: "Protein oats & berries",
    kcal: 430,
    range: "±60 kcal",
    confidence: 95,
    items: ["Rolled oats ~70g", "Whey isolate 1 scoop", "Mixed berries ~90g"],
    macros: { protein: 34, carbs: 52, fat: 8 },
    tag: "Breakfast",
  },
];

export function MealScanner() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const meal = meals[active]!;

  const select = (i: number) => {
    if (i === active) return;
    setLoading(true);
    setActive(i);
    window.setTimeout(() => setLoading(false), 1100);
  };

  return (
    <Section id="meals">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            label="AI meal scanner"
            title={
              <>
                Photograph it. <span className="text-gradient">Know it.</span>
              </>
            }
            description="No barcode hunting, no 40-item search results. One photo returns detected foods, portion estimates and a full macro breakdown - with the uncertainty printed right next to it."
          />

          <Reveal delay={0.1} className="mt-8 space-y-3">
            {[
              "Detects multi-item plates, sauces and cooking method",
              "Portion sizing calibrated against reference objects",
              "Logs straight into your daily macro budget",
              "Flags low-confidence guesses so you can correct them",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {line}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-2">
            {meals.map((m, i) => (
              <button
                key={m.id}
                onClick={() => select(i)}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  i === active ? "border-cyan/50 bg-cyan-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.tag}
              </button>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative rounded-3xl border border-border bg-surface/60 p-2 backdrop-blur glow-cyan">
            <div className="rounded-[20px] border border-border bg-background/80 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <Camera className="h-3.5 w-3.5 text-cyan" /> scan_result
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  <Gauge className="h-3 w-3 text-accent" /> {meal.confidence}% confidence
                </span>
              </div>

              {loading ? (
                <div className="py-12">
                  <EnFormaLoader text="Analyzing image..." />
                </div>
              ) : (
                <motion.div key={meal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{meal.name}</h3>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-semibold text-gradient">~{meal.kcal}</span>
                    <span className="text-sm text-muted-foreground">kcal {meal.range}</span>
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { k: "Protein", v: meal.macros.protein, c: "var(--cyan)" },
                      { k: "Carbs", v: meal.macros.carbs, c: "var(--lime)" },
                      { k: "Fat", v: meal.macros.fat, c: "var(--chart-4)" },
                    ].map((m) => (
                      <div key={m.k} className="rounded-2xl border border-border bg-surface/70 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{m.k}</p>
                        <p className="mt-1 font-display text-xl font-semibold">{m.v}g</p>
                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, m.v)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: m.c }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-6 space-y-2">
                    {meal.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-center justify-between rounded-xl border border-border bg-surface/40 px-4 py-2.5 text-sm text-muted-foreground"
                      >
                        {it}
                        <Upload className="h-3.5 w-3.5 opacity-40" />
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" />
                    Nutrition values are AI estimates, not laboratory measurements. Use them as a consistent trend, not an exact truth.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
