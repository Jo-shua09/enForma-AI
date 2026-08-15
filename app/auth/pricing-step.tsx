"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/landing/primitives";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

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

export function PricingStep({ onPlanSelect }: { onPlanSelect: (plan: string) => void }) {
  const [yearly, setYearly] = useState(true);
  const { user } = useAuth();

  const handlePlanSelect = async (planName: string) => {
    if (!user) {
      toast.error("You need to be logged in to select a plan.");
      return;
    }
    // Here you would typically update the user's plan in your backend.
    // For this example, we'll simulate it and call the callback.
    console.log(`User ${user.email} selected plan: ${planName}`);
    toast.success(`You have selected the ${planName} plan.`);
    onPlanSelect(planName);
  };

  return (
    <div className="max-w-[80rem] w-full">
      <SectionHeading
        align="left"
        label="Choose your plan"
        title={<>One last step.</>}
        description="Select a plan to get started. You can change this at any time."
      />

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
                onClick={() => handlePlanSelect(t.name)}
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
