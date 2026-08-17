"use client";

import { useState } from "react";
import { ArrowLeft, Check, Minus } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/landing/primitives";

const tiers = [
  {
    name: "Starter",
    price: { m: 0, y: 0 },
    desc: "Everything you need to build the habit.",
    features: ["10 meal scans / month", "1 AI workout plan", "Habit streaks & water tracking", "Basic progress charts"],
    missing: ["Form analysis", "Coach chat"],
    cta: "Start free",
  },
  {
    name: "Athlete",
    price: { m: 14, y: 11 },
    desc: "The full AI coaching stack, unlimited.",
    features: [
      "Unlimited meal scans",
      "Adaptive weekly programming",
      "Camera form analysis (5 lifts)",
      "Progression intelligence",
      "Coach chat with full history",
      "Apple Health & Garmin sync",
    ],
    missing: [],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Coach",
    price: { m: 39, y: 31 },
    desc: "For trainers running real rosters.",
    features: [
      "Everything in Athlete",
      "Up to 25 client seats",
      "Shared form review inbox",
      "Client compliance dashboard",
      "White-label PDF plans",
      "Priority support",
    ],
    missing: [],
    cta: "Talk to us",
  },
];

export function PricingStep({ onPlanSelect, onBack }: { onPlanSelect: (plan: string) => void; onBack?: () => void }) {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="max-w-[80rem] w-full">
      <div className="relative">
        {/* {onBack && (
          <button
            onClick={onBack}
            className="absolute -top-12 left-0 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to settings
          </button>
        )} */}
        <SectionHeading
          align="left"
          label={onBack ? "Change your plan" : "Choose your plan"}
          title={onBack ? <>Find the right fit.</> : <>One last step.</>}
          description="Select a plan to get started. You can change this at any time."
        />
      </div>

      <Reveal delay={0.06} className="mt-8 flex">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1">
          {[
            { k: false, l: "Monthly" },
            { k: true, l: "Yearly · save 20%" },
          ].map((o) => (
            <button
              key={o.l}
              onClick={() => setYearly(o.k)}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                yearly === o.k ? "bg-surface-2 text-foreground" : "text-muted-foreground"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-y-8 gap-x-5 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.07}>
            <div
              className={`relative flex h-full flex-col rounded-3xl border p-8 ${t.featured ? "border-cyan/40 bg-surface/70 glow-cyan" : "border-border bg-surface/40"}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 rounded-full border border-cyan/40 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold tracking-tight">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold tracking-tight">${yearly ? t.price.y : t.price.m}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-7 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {f}
                  </li>
                ))}
                {t.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground/50">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onPlanSelect(t.name)}
                className={`mt-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02] ${t.featured ? "bg-primary text-primary-foreground" : "border border-border bg-surface-2 text-foreground"}`}
              >
                Select Plan
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
